
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
export const runtime='nodejs'; 
export const dynamic='force-dynamic';

const DESIGN_PATH = 'settings/general'; // Keeping this path as it is the one being used in the app
const HEADER_PATH = 'pages/header';

export async function GET() {
  const [settingsSnap, headerSnap] = await Promise.all([
    adminDb.doc(DESIGN_PATH).get(),
    adminDb.doc(HEADER_PATH).get(),
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
    const q1 = await adminDb.collection('audit').where('type','==','designSettings').orderBy('ts','desc').limit(1).get();
    const q2 = await adminDb.collection('audit').where('type','==','headerSettings').orderBy('ts','desc').limit(1).get();
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
        settings: DESIGN_PATH,
        header: HEADER_PATH,
    },
    lastAudit: {
        design: lastDesignAudit?.ts ?? null,
        header: lastHeaderAudit?.ts ?? null
    },
  }, { headers: { 'cache-control': 'no-store' }});
}
