
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SETTINGS_PATH = 'settings/general';
const HEADER_PATH = 'pages/header';

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
  const [settingsSnap, headerSnap] = await Promise.all([
    db.doc(SETTINGS_PATH).get(),
    db.doc(HEADER_PATH).get(),
  ]);

  const settings = settingsSnap.exists ? settingsSnap.data() : null;
  const header = headerSnap.exists ? headerSnap.data() : null;

  const okSettingsDoc = !!settingsSnap.exists;
  const okHeaderDoc = !!headerSnap.exists;

  const okDesignVars = !!settings?.buttonSettings?.colors?.primary && !!settings?.buttonSettings?.designType;
  const okVersioning = typeof settings?.version === 'number' && typeof header?.version === 'number';
  const okLocked = settings?.locked === true;

  const ok = okSettingsDoc && okHeaderDoc && okDesignVars && okVersioning && okLocked;

  // (valgfrit) hent seneste audit pr. type
  let lastDesignAudit: any = null;
  let lastHeaderAudit: any = null;
  try {
    const q1 = await db.collection('audit').where('type','==','designSettings').orderBy('ts','desc').limit(1).get();
    const q2 = await db.collection('audit').where('type','==','headerSettings').orderBy('ts','desc').limit(1).get();
    lastDesignAudit = q1.empty ? null : q1.docs[0].data();
    lastHeaderAudit = q2.empty ? null : q2.docs[0].data();
  } catch { /* audit er valgfri */ }

  return NextResponse.json({
    ok,
    checks: {
      okSettingsDoc,
      okHeaderDoc,
      okDesignVars,
      okVersioning,
      okLocked,
    },
    versions: {
      settings: settings?.version ?? null,
      header: header?.version ?? null,
    },
    paths: {
        settings: SETTINGS_PATH,
        header: HEADER_PATH,
    },
    lastAudit: {
        design: lastDesignAudit ? toPlainObject(lastDesignAudit)?.ts : null,
        header: lastHeaderAudit ? toPlainObject(lastHeaderAudit)?.ts : null
    },
  }, { headers: { 'cache-control': 'no-store' }});
}
