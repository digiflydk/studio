
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
export const runtime='nodejs'; 
export const dynamic='force-dynamic';

const SETTINGS_PATH = 'settings/general';

export async function GET() {
  const settingsSnap = await adminDb.doc(SETTINGS_PATH).get();
  const settings = settingsSnap.exists ? settingsSnap.data() : null;

  const okSettingsDoc = !!settingsSnap.exists;

  const okDesignVars = !!settings?.buttonSettings?.colors?.primary && !!settings?.buttonSettings?.designType;
  const okVersioning = typeof settings?.version === 'number';
  const okLocked = settings?.locked === true;

  const ok = okSettingsDoc && okDesignVars && okVersioning && okLocked;

  // (valgfrit) hent seneste audit pr. type
  let lastAudit: any = null;
  try {
    const q1 = await adminDb.collection('audit').orderBy('ts','desc').limit(1).get();
    lastAudit = q1.empty ? null : q1.docs[0].data();
  } catch { /* audit er valgfri */ }

  return NextResponse.json({
    ok,
    checks: {
      okSettingsDoc, okDesignVars, okVersioning, okLocked,
    },
    versions: {
      settings: settings?.version ?? null,
    },
    paths: { settings: SETTINGS_PATH },
    lastAudit: lastAudit?.ts ?? null,
  }, { headers: { 'cache-control': 'no-store' }});
}
