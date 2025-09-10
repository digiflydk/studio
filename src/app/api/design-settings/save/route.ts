import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { GeneralSettings } from '@/types/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';
const PATH = `${SETTINGS_COLLECTION_ID}/${SETTINGS_DOC_ID}`;

export async function POST(request: Request) {
  try {
    const settingsToSave: Partial<GeneralSettings> = await request.json();
    
    // We only save the settings relevant to the design page
    const designSettings: Partial<GeneralSettings> = {
        themeColors: settingsToSave.themeColors,
        typography: settingsToSave.typography,
        buttonSettings: settingsToSave.buttonSettings,
    };

    await adminDb.doc(PATH).set(designSettings, { merge: true });

    revalidateTag('design-settings');

    const updatedSnap = await adminDb.doc(PATH).get();
    const updatedData = updatedSnap.data();

    return NextResponse.json({ 
        ok: true, 
        message: 'Design settings saved.',
        data: updatedData,
    }, { headers: { 'cache-control': 'no-store' } });

  } catch (error: any) {
    console.error('Error saving design settings:', error);
    return NextResponse.json({ ok: false, message: 'An error occurred during saving.', error: error.message }, { status: 500 });
  }
}
