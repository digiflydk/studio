
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { headerSettingsSchema } from '@/lib/validators/headerSettings.zod';

export const runtime='nodejs';
export const dynamic='force-dynamic';

export async function POST(req: Request) {
  const db = getAdminDb();
  const body = await req.json();   // { version?: number, ...headerFields }
  const clientVersion = Number(body?.version ?? 0);
  const parsed = headerSettingsSchema.parse(body);

  const ref = db.doc('settings/general');
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
      headerCtaSettings: { ...(current?.headerCtaSettings ?? {}), ...parsed },
      version: serverVersion + 1,
      updatedAt: now,
      updatedBy: 'cms-user',
    };

    tx.set(ref, next, { merge:false });
    return { ok:true as const, data: next };
  });

  if (!result.ok) return NextResponse.json(result, { status: result.status ?? 400 });

  const g = result.data as any;
  const payload = { version: g.version ?? 0, ...(g.headerCtaSettings ?? {}) };
  return NextResponse.json({ ok:true, data: payload }, { headers:{'cache-control':'no-store'}});
}
