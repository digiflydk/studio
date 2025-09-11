
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { headerSettingsSchema } from '@/lib/validators/headerSettings.zod';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function POST(req: Request) {
  const db = adminDb;
  const body = await req.json();
  const clientVersion = Number(body?.version ?? 0);
  
  const { version, ...ctaData } = body;
  const parsed = headerSettingsSchema.parse(ctaData);

  const ref = db.doc('settings/general');

  try {
    const result = await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const now = new Date().toISOString();
      const current = snap.exists ? (snap.data() as any) : {};
      const serverVersion = Number(current?.version ?? 0);

      if (snap.exists && clientVersion !== serverVersion) {
        return { ok:false as const, status:409, error:'version_conflict', current, currentVersion: serverVersion };
      }

      const next = {
        ...current,
        header: {
            ...(current.header ?? {}),
            cta: parsed
        },
        version: serverVersion + 1,
        updatedAt: now,
        updatedBy: 'cms-user',
      };

      tx.set(ref, next, { merge: false });
      return { ok:true as const, data: next };
    });

    if (!result.ok) return NextResponse.json(result, { status: result.status ?? 400 });

    const g = result.data as any;
    const payload = { version: g.version ?? 0, ...(g.header?.cta ?? {}) };
    return NextResponse.json({ ok:true, data: payload }, { headers:{'cache-control':'no-store'}});
  } catch (error: any) {
    console.error("CTA settings save failed:", error);
    if (error.name === 'ZodError') {
        return NextResponse.json({ ok: false, error: 'Validation failed', issues: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
