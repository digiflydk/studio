
'use server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderCTASettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';
import { headerDefaults } from '@/lib/cms/pages-header';


const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';


export const getGeneralSettings = unstable_cache(
    async (): Promise<GeneralSettings | null> => {
        try {
            const settingsDocRef = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
            const docSnap = await settingsDocRef.get();

            if (docSnap.exists) {
                const data = docSnap.data() as GeneralSettings;
                
                // Ensure headerCtaSettings has defaults
                const headerCtaSettings = { ...headerDefaults, ...data.headerCtaSettings };
                data.headerCtaSettings = headerCtaSettings;

                // Backwards compatibility for old header settings
                if (data && 'headerBackgroundColor' in data && !data.headerScrolledBackgroundColor) {
                    data.headerScrolledBackgroundColor = (data as any).headerBackgroundColor;
                }
                if (data && 'headerBackgroundOpacity' in data && !data.headerScrolledBackgroundOpacity) {
                    data.headerScrolledBackgroundOpacity = (data as any).headerBackgroundOpacity;
                }
                
                return data;
            }

            // If doc doesn't exist, create it with a lock to prevent backfill races (DF231)
            console.log("Settings document not found, creating with defaults and lock.");
            const defaultData: Partial<GeneralSettings> = { 
                headerCtaSettings: headerDefaults,
                locked: true, // Anti-backfill lock
            };
            await settingsDocRef.set(defaultData);
            return defaultData as GeneralSettings;

        } catch (error) {
            console.error("SETTINGS_SERVICE_ERROR: Error fetching general settings: ", error);
            // On error, return a minimal default object to allow build/app to continue
            const minimalDefaults: Partial<GeneralSettings> = {
                headerCtaSettings: headerDefaults
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
