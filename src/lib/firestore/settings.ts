
// lib/firestore/settings.ts
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings } from '@/types/settings';
import type { HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

export const headerDefaults: HeaderSettings = {
    isOverlay: false,
    headerIsSticky: true,
    headerHeight: 80,
    headerLogoWidth: 150,
    headerLinkColor: 'black',
    headerLinkColorHex: undefined,
    logo: { src: 'https://i.postimg.cc/pL55xDxd/DIGIFLY-black-wo-bg.png', scrolledSrc: undefined, alt: 'Digifly logo – digitalt konsulenthus med fokus på AI, automatisering og skalering', maxWidth: 150 },
    border: { enabled: false, widthPx: 1, colorHex: '#000000', color: { h: 0, s: 0, l: 0, opacity: 100 } },
    topBg: { h: 0, s: 0, l: 100, opacity: 100 },
    scrolledBg: { h: 0, s: 0, l: 100, opacity: 100 },
    navLinks: [],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
    version: 0,
    cta: {
        enabled: false,
        label: "Book et møde",
        linkType: "external",
        href: "#",
        variant: "default",
        size: "lg",
        mobileFloating: {
            enabled: false,
            position: 'br',
            offsetX: 16,
            offsetY: 16
        }
    }
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
                header: headerDefaults,
            };
            await settingsDocRef.set(defaultData);
            return defaultData as GeneralSettings;

        } catch (error) {
            console.error("SETTINGS_SERVICE_ERROR: Error fetching general settings: ", error);
            const minimalDefaults: Partial<GeneralSettings> = {
                header: headerDefaults,
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
