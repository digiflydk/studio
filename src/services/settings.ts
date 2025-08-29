
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

export interface GeneralSettings {
    websiteTitle?: string;
    logoUrl?: string;
    logoAlt?: string;
    faviconUrl?: string;
    companyName?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    phoneNumber?: string;
    businessEmail?: string;
    cvr?: string;
    country?: string;
    openingHours?: Record<string, { from: string; to: string; isOpen: boolean }>;
    allowSearchEngineIndexing?: boolean;
}

export async function getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
        const settingsCollection = collection(db, SETTINGS_COLLECTION_ID);
        const docRef = doc(settingsCollection, SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as GeneralSettings;
        } else {
            console.log("No settings document found, returning null.");
            return null;
        }
    } catch (error) {
        console.error("Error getting settings document:", error);
        // Return null instead of throwing an error to prevent the app from crashing.
        // The page will load with initial/empty state.
        return null;
    }
}

export async function saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    try {
        const settingsCollection = collection(db, SETTINGS_COLLECTION_ID);
        const docRef = doc(settingsCollection, SETTINGS_DOC_ID);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error writing document:", error);
        throw new Error("Could not save settings to database.");
    }
}
