
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
    description:string;
    imageUrl: string;
    linkedinUrl: string;
    aiHint: string;
}

export interface NavLink {
    label: string;
    href: string;
}

export interface Customer {
    id: string;
    name: string;
    logoUrl: string;
    aiHint: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown content
    featuredImageUrl: string;
    metaDescription: string;
    aiHint: string;
    publishedAt: Date;
}


export type SectionPadding = {
    top: number;
    bottom: number;
    topMobile: number;
    bottomMobile: number;
}

export interface SectionVisibility {
    services: boolean;
    aiProject: boolean;
    cases: boolean;
    about: boolean;
    customers: boolean;
    blog: boolean;
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

    // AI Settings
    aiProvider?: 'googleai' | 'openai';
    aiModel?: string;
    aiGreetingMessage?: string;
    aiSystemPrompt?: string; // Used for Google AI
    aiSystemPromptOpenAI?: string; // Used for OpenAI

    // Design Settings
    themeColors?: {
        primary: HSLColor;
        background: HSLColor;
        accent: HSLColor;
    };
    themeFontSizes?: FontSizes;
    
    // Header Settings
    headerNavLinks?: NavLink[];
    headerLogoWidth?: number;
    headerHeight?: number;
    headerInitialBackgroundColor?: HSLColor;
    headerInitialBackgroundOpacity?: number;
    headerScrolledBackgroundColor?: HSLColor;
    headerScrolledBackgroundOpacity?: number;
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
    footerLogoUrl?: string;
    footerLogoAlt?: string;
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
    heroHeadlineSizeMobile?: number;
    heroDescription?: string;
    heroDescriptionColor?: string;
    heroDescriptionSize?: number;
    heroDescriptionSizeMobile?: number;
    heroImageUrl?: string;
    heroAlignment?: 'left' | 'center' | 'right';
    heroVerticalAlignment?: 'top' | 'center' | 'bottom';
    heroTextMaxWidth?: number;
    heroCtaEnabled?: boolean;
    heroCtaText?: string;
    heroCtaLink?: string;
    heroCtaVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'pill';
    heroCtaSize?: 'default' | 'sm' | 'lg' | 'icon';
    heroCtaTextSize?: number;
    heroCtaTextSizeMobile?: number;
    
    servicesSectionTitle?: string;
    servicesSectionTitleColor?: string;
    servicesSectionTitleSize?: number;
    servicesSectionDescription?: string;
    servicesSectionDescriptionColor?: string;
    servicesSectionDescriptionSize?: number;
    services?: Service[];
    serviceCardTitleColor?: string;
    serviceCardTitleSize?: number;
    serviceCardDescriptionColor?: string;
    serviceCardDescriptionSize?: number;

    aiProjectSectionIconText?: string;
    aiProjectSectionTitle?: string;
    aiProjectSectionTitleColor?: string;
    aiProjectSectionTitleSize?: number;
    aiProjectSectionDescription?: string;
    aiProjectSectionDescriptionColor?: string;
    aiProjectSectionDescriptionSize?: number;
    aiProjectSectionBackgroundColor?: HSLColor;

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
    teamMemberNameColor?: string;
    teamMemberNameSize?: number;
    teamMemberTitleColor?: string;
    teamMemberTitleSize?: number;
    teamMemberDescriptionColor?: string;
    teamMemberDescriptionSize?: number;
    
    customersSectionTitle?: string;
    customersSectionTitleColor?: string;
    customersSectionTitleSize?: number;
    customersSectionDescription?: string;
    customersSectionDescriptionColor?: string;
    customersSectionDescriptionSize?: number;
    customersSectionBackgroundColor?: HSLColor;
    
    blogSectionTitle?: string;
    blogSectionTitleColor?: string;
    blogSectionTitleSize?: number;
    blogSectionDescription?: string;
    blogSectionDescriptionColor?: string;
    blogSectionDescriptionSize?: number;
    blogSectionBackgroundColor?: HSLColor;


    // Spacing
    sectionPadding?: {
        services: SectionPadding;
        aiProject: SectionPadding;
        cases: SectionPadding;
        about: SectionPadding;
        customers: SectionPadding;
        blog: SectionPadding;
        contact: SectionPadding;
    };
    
    // Section Visibility
    sectionVisibility?: SectionVisibility;

    // Customers
    customers?: Customer[];
    
    // Blog
    blogPosts?: BlogPost[];
}


export async function getGeneralSettings(): Promise<GeneralSettings | null> {
    try {
        const settingsDocRef = doc(db, SETTINGS_COLLECTION_ID, SETTINGS_DOC_ID);
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data() as GeneralSettings;
            // Backwards compatibility for old header settings
            if ('headerBackgroundColor' in data && !data.headerScrolledBackgroundColor) {
                data.headerScrolledBackgroundColor = (data as any).headerBackgroundColor;
            }
             if ('headerBackgroundOpacity' in data && !data.headerScrolledBackgroundOpacity) {
                data.headerScrolledBackgroundOpacity = (data as any).headerBackgroundOpacity;
            }
            return data;
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
