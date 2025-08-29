
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
}

export async function getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
        const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as GeneralSettings;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Could not fetch settings from database.");
    }
}

export async function saveGeneralSettings(settings: GeneralSettings): Promise<void> {
    try {
        const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
        await setDoc(docRef, settings, { merge: true });
    } catch (error) {
        console.error("Error writing document:", error);
        throw new Error("Could not save settings to database.");
    }
}
