
import type { z } from 'zod';
import type { headerSettingsSchema } from "@/lib/validators/headerSettings.zod";
import { headerAppearanceSchema } from '@/lib/validators/headerAppearance.zod';

export type HSLColor = { h: number; s: number; l: number };

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
    title:string;
    description: string;
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

export interface TabbedContentItem {
    title: string;
    description: string;
    imageUrl: string;
    aiHint: string;
    link: string;
    linkText: string;
}

export type SectionPadding = {
    top: number;
    bottom: number;
    topMobile: number;
    bottomMobile: number;
}

export interface SectionVisibility {
    hero?: boolean;
    feature?: boolean;
    services?: boolean;
    aiProject?: boolean;
    cases?: boolean;
    about?: boolean;
    customers?: boolean;
    contact?: boolean;
    tabs?: boolean;
}

export type Alignment = 'left' | 'center' | 'right';

export interface HeroGridImage {
    url: string;
    aiHint: string;
}

export type TypographyElementSettings = {
    sizeMobile: number;
    sizeDesktop: number;
    weight: number;
    lineHeight: number;
};

export type BodyTypographySettings = {
    size: number;
    weight: number;
    lineHeight: number;
}

export interface TypographySettings {
    fontPrimary: string;
    fontSecondary: string;
    h1: TypographyElementSettings;
    h2: TypographyElementSettings;
    h3: TypographyElementSettings;
    h4: TypographyElementSettings;
    body: BodyTypographySettings;
}

export type ConsentCategories = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export interface CookieSettings {
    consentLifetimeDays: number;
    defaults: Omit<ConsentCategories, 'necessary'>;
    bannerTitle: string;
    bannerBody: string;
    acceptAllLabel: string;
    acceptNecessaryLabel: string;
    settingsLabel: string;
    modalTitle: string;
    modalBody: string;
    saveLabel: string;
    privacyPolicyLabel: string;
    privacyPolicyUrl: string;
    categoryPreferencesTitle: string;
    categoryPreferencesBody: string;
    categoryAnalyticsTitle: string;
    categoryAnalyticsBody: string;
    categoryMarketingTitle: string;
    categoryMarketingBody: string;
}

export type ButtonDesignType = 'default' | 'pill';
export type ButtonVariantOption = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'pill';
export type ButtonFontOption = 'Inter' | 'Manrope' | 'System';
export type ButtonSizeOption = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonSettings {
  designType: ButtonDesignType;
  fontFamily: ButtonFontOption;
  fontWeight: number;
  colors: {
    primary: string;
    secondary: string;
    hover: string;
    text?: string;
  };
  radius?: number;
  textSize?: 'sm'|'md'|'lg';
  defaultVariant: ButtonVariantOption;
  defaultSize: ButtonSizeOption;
}

export type HeaderCTASettings = z.infer<typeof headerSettingsSchema>;

export type HeaderSettings = z.infer<typeof headerAppearanceSchema> & {
    cta?: HeaderCTASettings;
    sticky?: boolean;
};

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    companyName?: string;
    ownerId: string;
    status: 'active' | 'inactive' | 'draft';
    street?: string;
    zipCode?: string;
    city?: string;
    country?: string;
    currency: string;
    companyRegNo?: string;
    foodCategories: string[];
    locationsCount: number;
}


export interface GeneralSettings {
    brandPrimary?: string;
    brandSecondary?: string;
    textColor?: string;
    linkColor?: string;
    fontFamily?: string;
    fontScale?: number;
    spacingBase?: number;
    locked?: boolean;
    websiteTitle?: string;
    logoUrl?: string;
    logoAlt?: string;
    logoScrolledUrl?: string;
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
    
    enableGtm?: boolean;
    gtmId?: string;
    enableGoogleAnalytics?: boolean;
    googleAnalyticsId?: string;
    enableFacebookPixel?: boolean;
    facebookPixelId?: string;
    enableGoogleAds?: boolean;
    googleAdsId?: string;

    cookies?: CookieSettings;

    aiProvider?: 'googleai' | 'openai';
    aiModel?: string;
    aiGreetingMessage?: string;
    aiSystemPrompt?: string; 
    aiSystemPromptOpenAI?: string;

    themeColors?: {
        primary: HSLColor;
        background: HSLColor;
        accent: HSLColor;
    };
    typography?: TypographySettings;
    buttonSettings?: ButtonSettings;
    buttons?: any; // legacy
    
    header?: HeaderSettings;
    headerIsSticky?: boolean;
    headerHeight?: number;
    headerLogoWidth?: number;
    headerInitialBackgroundColor?: HSLColor;
    headerInitialBackgroundOpacity?: number;
    headerScrolledBackgroundColor?: HSLColor;
    headerScrolledBackgroundOpacity?: number;
    headerLinkColor?: string;
    headerNavLinks?: NavLink[];


    footer?: {
        enabled?: boolean;
        bg?: string;
        bgColor?: string;
        textColor?: string;
        linkColor?: string;
        linkHoverColor?: string;
        isVisible?: boolean;
        border?: { enabled?: boolean; width?: number; color?: string };
    };
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

    homePageSectionOrder?: string[];

    hero?: {
        offsetMode?: 'auto'|'fixed';
        fixedOffset?: number;
        bg?: string;
        title?: string;
        subtitle?: string;
        cta?: { text?: string; variant?: 'primary'|'secondary'|'outline'|'destructive' };
    };
    heroLayout?: 'fullWidthImage' | 'textWithImageGrid';
    heroImageUrl?: string;
    heroGridImage1Url?: string;
    heroGridImage1AiHint?: string;
    heroGridImage2Url?: string;
    heroGridImage2AiHint?: string;
    heroGridImage3Url?: string;
    heroGridImage3AiHint?: string;
    heroGridImage4Url?: string;
    heroGridImage4AiHint?: string;
    heroHeadline?: string;
    heroHeadlineColor?: string;
    heroHeadlineSize?: number;
    heroHeadlineSizeMobile?: number;
    heroDescription?: string;
    heroDescriptionColor?: string;
    heroDescriptionSize?: number;
    heroDescriptionSizeMobile?: number;
    heroAlignment?: Alignment;
    heroVerticalAlignment?: 'top' | 'center' | 'bottom';
    heroTextMaxWidth?: number;
    heroCtaEnabled?: boolean;
    heroCtaText?: string;
    heroCtaLink?: string;
    heroCtaVariant?: ButtonVariantOption;
    heroCtaSize?: ButtonSizeOption;
    heroCtaTextSize?: number;
    heroCtaTextSizeMobile?: number;
    heroSectionBackgroundColor?: HSLColor;
    
    featureSectionHeading?: string;
    featureSectionHeadingColor?: string;
    featureSectionHeadingSize?: number;
    featureSectionHeadingSizeMobile?: number;
    featureSectionBody?: string;
    featureSectionBodyColor?: string;
    featureSectionBodySize?: number;
    featureSectionBodySizeMobile?: number;
    featureSectionImageUrl?: string;
    featureSectionAiHint?: string;
    featureSectionCtaEnabled?: boolean;
    featureSectionCtaText?: string;
    featureSectionCtaLink?: string;
    featureSectionCtaVariant?: ButtonVariantOption;
    featureSectionCtaSize?: ButtonSizeOption;
    featureSectionCtaTextSize?: number;
    featureSectionCtaTextSizeMobile?: number;
    featureSectionBackgroundColor?: HSLColor;
    featureSectionAlignment?: Alignment;
    
    servicesSectionTitle?: string;
    servicesSectionTitleColor?: string;
    servicesSectionTitleSize?: number;
    servicesSectionDescription?: string;
    servicesSectionDescriptionColor?: string;
    servicesSectionDescriptionSize?: number;
    servicesSectionAlignment?: Alignment;
    servicesSectionBackgroundColor?: HSLColor;
    services?: Service[];
    serviceCardTitleColor?: string;
    serviceCardTitleSize?: number;
    serviceCardDescriptionColor?: string;
    serviceCardDescriptionSize?: number;
    servicesCtaEnabled?: boolean;
    servicesCtaText?: string;
    servicesCtaLink?: string;
    servicesCtaVariant?: ButtonVariantOption;
    servicesCtaSize?: ButtonSizeOption;
    servicesCtaTextSize?: number;
    servicesCtaTextSizeMobile?: number;

    aiProjectSectionIconText?: string;
    aiProjectSectionTitle?: string;
    aiProjectSectionTitleColor?: string;
    aiProjectSectionTitleSize?: number;
    aiProjectSectionDescription?: string;
    aiProjectSectionDescriptionColor?: string;
    aiProjectSectionDescriptionSize?: number;
    aiProjectSectionBackgroundColor?: HSLColor;
    aiProjectSectionAlignment?: Alignment;

    casesSectionTitle?: string;
    casesSectionTitleColor?: string;
    casesSectionTitleSize?: number;
    casesSectionDescription?: string;
    casesSectionDescriptionColor?: string;
    casesSectionDescriptionSize?: number;
    casesSectionAlignment?: Alignment;
    casesSectionBackgroundColor?: HSLColor;
    cases?: Case[];
    
    aboutSectionTitle?: string;
    aboutSectionTitleColor?: string;
    aboutSectionTitleSize?: number;
    aboutText?: string;
    aboutTextColor?: string;
    aboutTextSize?: number;
    aboutSectionAlignment?: Alignment;
    aboutSectionBackgroundColor?: HSLColor;
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
    customersSectionAlignment?: Alignment;

    contactSectionBackgroundColor?: HSLColor;

    tabbedContentSectionTitle?: string;
    tabbedContentItems?: TabbedContentItem[];
    tabbedContentSectionBackgroundColor?: HSLColor;

    sectionPadding?: Partial<Record<keyof SectionVisibility, SectionPadding>>;
    
    sectionVisibility?: SectionVisibility;

    customers?: Customer[];
}

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'pill';
export type ButtonSize = 'default' | 'sm' | 'lg';
