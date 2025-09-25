
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { buttonSettingsSchema } from '@/lib/validators/buttonSettings.zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readBody(req: Request): Promise<any | null> {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try { 
      const body = await req.json();
      return body;
    } catch { 
      return null; 
    }
  }
  return null;
}

export async function POST(req: Request) {
  const db = adminDb;
  const body = await readBody(req);
  
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "EMPTY_OR_INVALID_BODY" }, { status: 400 });
  }
  
  const clientVersion = Number(body?.version ?? 0);
  
  try {
      const parsed = buttonSettingsSchema.parse(body);

      const ref = db.doc('settings/general');

      const res = await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        const now = new Date().toISOString();

        const current = snap.exists ? (snap.data() as any) : {};
        const serverVersion = Number(current?.version ?? 0);

        if (snap.exists && clientVersion !== serverVersion) {
          return { ok: false as const, status: 409, error: 'version_conflict', current, currentVersion: serverVersion };
        }

        const next = {
          ...current,
          buttonSettings: { ...(current?.buttonSettings ?? {}), ...parsed },
          version: serverVersion + 1,
          updatedAt: now,
          updatedBy: 'cms-user',
        };

        tx.set(ref, next, { merge: false });
        return { ok: true as const, data: next };
      });

      if (!res.ok) return NextResponse.json(res, { status: res.status ?? 400 });

      const g = res.data as any;
      const payload = { version: g.version ?? 0, ...(g.buttonSettings ?? {}) };

      return NextResponse.json({ ok: true, data: payload }, { headers: { 'cache-control': 'no-store' } });
  } catch (error: any) {
     if (error.name === 'ZodError') {
        return NextResponse.json({ ok: false, error: 'Validation failed', issues: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'An unexpected error occurred', message: error.message }, { status: 500 });
  }
}
