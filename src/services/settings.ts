
'use server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

type HSLColor = { h: number; s: number; l: number };
type FontSizes = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  body: number;
};

export interface Service {
    title: string;
    description: string;
    imageUrl: string;
    aiHint: string;
}

export interface Case {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    aiHint: string;
}

export interface TeamMember {
    name: string;
    title: string;
    description: string;
    imageUrl: string;
    linkedinUrl: string;
    aiHint: string;
}

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
    seoTitle?: string;
    metaDescription?: string;
    socialShareImageUrl?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    tiktokUrl?: string;
    
    // Tracking settings
    enableGtm?: boolean;
    gtmId?: string;
    enableGoogleAnalytics?: boolean;
    googleAnalyticsId?: string;
    enableFacebookPixel?: boolean;
    facebookPixelId?: string;
    enableGoogleAds?: boolean;
    googleAdsId?: string;

    // Design Settings
    themeColors?: {
        primary: HSLColor;
        background: HSLColor;
        accent: HSLColor;
    };
    themeFontSizes?: FontSizes;
    
    // Header Settings
    headerLogoWidth?: number;
    headerBackgroundColor?: HSLColor;
    headerBackgroundOpacity?: number;
    headerIsSticky?: boolean;
    headerMenuIconColor?: string;
    headerLinkColor?: string;
    headerLinkHoverColor?: string;
    headerLinkSize?: number;

    // Footer Settings
    footerTagline?: string;
    footerDescription?: string;
    footerDescriptionColor?: string;
    footerDescriptionSize?: number;
    footerLogoWidth?: number;
    footerBackgroundColor?: HSLColor;
    footerCompanyNameColor?: string;
    footerCompanyNameSize?: number;
    footerAddressColor?: string;
    footerAddressSize?: number;
    footerContactColor?: string;
    footerContactSize?: number;

    // Home Page Content
    heroHeadline?: string;
    heroHeadlineColor?: string;
    heroHeadlineSize?: number;
    heroDescription?: string;
    heroDescriptionColor?: string;
    heroDescriptionSize?: number;
    heroImageUrl?: string;
    servicesSectionTitle?: string;
    servicesSectionTitleColor?: string;
    servicesSectionTitleSize?: number;
    servicesSectionDescription?: string;
    servicesSectionDescriptionColor?: string;
    servicesSectionDescriptionSize?: number;
    services?: Service[];
    casesSectionTitle?: string;
    casesSectionTitleColor?: string;
    casesSectionTitleSize?: number;
    casesSectionDescription?: string;
    casesSectionDescriptionColor?: string;
    casesSectionDescriptionSize?: number;
    cases?: Case[];
    aboutSectionTitle?: string;
    aboutSectionTitleColor?: string;
    aboutSectionTitleSize?: number;
    aboutText?: string;
    aboutTextColor?: string;
    aboutTextSize?: number;
    teamMembers?: TeamMember[];

    // Spacing
    sectionPadding?: {
        services: { top: number; bottom: number };
        aiProject: { top: number; bottom: number };
        cases: { top: number; bottom: number };
        about: { top: number; bottom: number };
        contact: { top: number; bottom: number };
    };
}


export async function getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION_ID, SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as GeneralSettings;
        }
        return null;
    } catch (error) {
        console.error("Error fetching general settings: ", error);
        return null;
    }
}


export async function saveGeneralSettings(settings: Partial<GeneralSettings>): Promise<void> {
    try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION_ID, SETTINGS_DOC_ID);
        await setDoc(settingsDocRef, settings, { merge: true });
    } catch (error) {
        console.error("Error saving general settings: ", error);
        throw new Error("Could not save settings.");
    }
}
