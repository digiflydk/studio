
'use server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { GeneralSettings, HeaderCTASettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';
import { headerDefaults } from '@/lib/cms/pages-header';


const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';


export const getGeneralSettings = unstable_cache(
    async (): Promise<GeneralSettings | null> => {
        try {
            const settingsDocRef = doc(db, SETTINGS_COLLECTION_ID, SETTINGS_DOC_ID);
            const docSnap = await getDoc(settingsDocRef);

            if (docSnap.exists()) {
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

            return { headerCtaSettings: headerDefaults };

        } catch (error) {
            console.error("SETTINGS_SERVICE_ERROR: Error fetching general settings: ", error);
            return { headerCtaSettings: headerDefaults }; // Return defaults on error to allow build to continue
        }
    },
    ['design-settings'],
    {
        tags: ['design-settings'],
    }
)


export async function saveGeneralSettings(settings: Partial<GeneralSettings>): Promise<void> {
    try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION_ID, SETTINGS_DOC_ID);
        await setDoc(settingsDocRef, settings, { merge: true });
    } catch (error) {
        console.error("Error saving general settings: ", error);
        throw new Error("Could not save settings.");
    }
}
