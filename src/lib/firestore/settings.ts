
// lib/firestore/settings.ts
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

const headerDefaults: HeaderSettings = {
    height: 72,
    logo: { maxWidth: 140 },
    border: { enabled: false, width: 1, color: {h: 220, s: 13, l: 91} },
    bg: {
      initial: { h: 255, s: 255, l: 255, opacity: 1 },
      scrolled: { h: 255, s: 255, l: 255, opacity: 1 },
    },
    navLinks: [],
    cta: {
        enabled: false,
        label: 'Kom i gang',
        linkType: 'internal',
        href: '#hero',
        variant: 'default',
        size: 'default',
        mobileFloating: { enabled: false, position: 'br', offsetX: 16, offsetY: 16 },
    }
};

export const getGeneralSettings = unstable_cache(
    async (): Promise<GeneralSettings | null> => {
        try {
            const settingsDocRef = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
            const docSnap = await settingsDocRef.get();

            if (docSnap.exists) {
                const data = docSnap.data() as GeneralSettings;
                
                data.header = {
                    ...headerDefaults,
                    ...(data.header ?? {}),
                    logo: { ...headerDefaults.logo, ...data.header?.logo },
                    border: { ...headerDefaults.border, ...data.header?.border },
                    bg: { ...headerDefaults.bg, ...data.header?.bg,
                        initial: { ...headerDefaults.bg.initial, ...data.header?.bg?.initial },
                        scrolled: { ...headerDefaults.bg.scrolled, ...data.header?.bg?.scrolled },
                    },
                    cta: { ...headerDefaults.cta, ...data.header?.cta,
                        mobileFloating: { ...headerDefaults.cta!.mobileFloating, ...data.header?.cta?.mobileFloating }
                    },
                };
                
                return data;
            }

            console.log("Settings document not found, creating with defaults.");
            const defaultData: Partial<GeneralSettings> = { 
                header: headerDefaults,
            };
            await settingsDocRef.set(defaultData);
            return defaultData as GeneralSettings;

        } catch (error) {
            console.error("SETTINGS_SERVICE_ERROR: Error fetching general settings: ", error);
            const minimalDefaults: Partial<GeneralSettings> = {
                header: headerDefaults
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
