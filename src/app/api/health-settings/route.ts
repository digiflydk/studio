
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toPlainObject(obj: any) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj.toDate) { // Firestore Timestamp
        return obj.toDate().toISOString();
    }
    if (Array.isArray(obj)) {
        return obj.map(toPlainObject);
    }
    const plain: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            plain[key] = toPlainObject(obj[key]);
        }
    }
    return plain;
}


export async function GET() {
  const db = getAdminDb();

  // primær: settings/general
  const gen = await db.doc('settings/general').get();
  const g = gen.exists ? (gen.data() as any) : null;

  // legacy: designSettings/global + pages/header
  const ds = await db.doc('designSettings/global').get();
  const ph = await db.doc('pages/header').get();

  const okGeneral = !!g;
  const okButtons = !!g?.buttonSettings?.colors?.primary || !!(ds.exists && (ds.data() as any)?.buttons);
  const okHeader = !!g?.headerCtaSettings || ph.exists;

  const okVersioning = typeof g?.version === 'number' || typeof (ds.data() as any)?.version === 'number';

  const ok = okGeneral && okButtons && okHeader && okVersioning;

  return NextResponse.json({
    ok,
    checks: { okGeneral, okButtons, okHeader, okVersioning },
    paths: { general: 'settings/general', legacyDesign: 'designSettings/global', legacyHeader: 'pages/header' },
    versions: { general: g?.version ?? null, legacyDesign: (ds.data() as any)?.version ?? null }
  }, { headers: { 'cache-control':'no-store' }});
}
