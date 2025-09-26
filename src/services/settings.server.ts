import "server-only";
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings } from '@/types/settings';

export async function getGeneralSettingsServer(): Promise<GeneralSettings | null> {
    const snap = await adminDb.doc('settings/general').get();
    return snap.exists ? (snap.data() as GeneralSettings) : null;
}
