
// lib/firestore/settings.ts
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings } from '@/types/settings';
import type { HeaderSettings } from '@/lib/validators/headerAppearance.zod';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

export const headerDefaults: HeaderSettings = {
    isOverlay: false,
    headerIsSticky: true,
    headerHeight: 72,
    headerLogoWidth: 140,
    headerLinkColor: "text-black",
    logo: { src: undefined, scrolledSrc: undefined, alt: undefined, maxWidth: 140 },
    border: { enabled: false, widthPx: 1, color: { h: 220, s: 13, l: 91 } },
    topBg: { h: 0, s: 0, l: 100, opacity: 1 },
    scrolledBg: { h: 0, s: 0, l: 100, opacity: 1 },
    navLinks: [],
    version: 0,
    updatedAt: '',
    updatedBy: '',
};

export const getGeneralSettings = unstable_cache(
    async (): Promise<GeneralSettings | null> => {
        try {
            const settingsDocRef = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
            const docSnap = await settingsDocRef.get();

            if (docSnap.exists) {
                const data = docSnap.data() as GeneralSettings;
                return data;
            }

            console.log("Settings document not found, creating with defaults.");
            const defaultData: Partial<GeneralSettings> = { 
                header: headerDefaults as any, // Cast to any to satisfy TS here
            };
            await settingsDocRef.set(defaultData);
            return defaultData as GeneralSettings;

        } catch (error) {
            console.error("SETTINGS_SERVICE_ERROR: Error fetching general settings: ", error);
            const minimalDefaults: Partial<GeneralSettings> = {
                header: headerDefaults as any, // Cast to any
            };
            return minimalDefaults as GeneralSettings;
        }
    },
    ['design-settings'],
    {
        tags: ['design-settings'],
    }
)


export async function saveGeneralSettings(settings: Partial<GeneralSettings>): Promise<{ success: boolean, message: string }> {
    try {
        const settingsDocRef = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
        await settingsDocRef.set(settings, { merge: true });
        return { success: true, message: 'Settings saved.' };
    } catch (error) {
        console.error("Error saving general settings: ", error);
        return { success: false, message: 'Could not save settings.' };
    }
}
