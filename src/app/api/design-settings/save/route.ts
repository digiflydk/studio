
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { buttonSettingsSchema } from '@/lib/validators/buttonSettings.zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const db = adminDb;
  const body = await req.json(); // forventer { version?: number, ...buttonSettings }
  const clientVersion = Number(body?.version ?? 0);
  const parsed = buttonSettingsSchema.parse(body);

  const ref = db.doc('settings/general');

  // Versioneret save (simpel transaktion)
  const res = await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const now = new Date().toISOString();

    const current = snap.exists ? (snap.data() as any) : {};
    const serverVersion = Number(current?.version ?? 0);

    // konflikt?
    if (snap.exists && clientVersion !== serverVersion) {
      return { ok: false as const, status: 409, error: 'version_conflict', current, currentVersion: serverVersion };
    }

    const next = {
      ...current,
      buttonSettings: { ...(current?.buttonSettings ?? {}), ...parsed },
      version: serverVersion + 1,
      updatedAt: now,
      updatedBy: 'cms-user', // byt evt. til req.headers.get('x-user') ?? 'cms'
    };

    tx.set(ref, next, { merge: false });
    return { ok: true as const, data: next };
  });

  if (!res.ok) return NextResponse.json(res, { status: res.status ?? 400 });

  // Returnér formen i samme format som GET (flatten + version)
  const g = res.data as any;
  const payload = { version: g.version ?? 0, ...(g.buttonSettings ?? {}) };

  return NextResponse.json({ ok: true, data: payload }, { headers: { 'cache-control': 'no-store' } });
}
