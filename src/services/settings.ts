
'use server';

import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

const headerDefaults: HeaderSettings = {
    isOverlay: false,
    headerIsSticky: true,
    headerHeight: 80,
    headerLogoWidth: 150,
    headerLinkColor: 'black',
    headerLinkColorHex: undefined, // bevares hvis sat via CMS

    logo: {
        src: 'https://i.postimg.cc/pL55xDxd/DIGIFLY-black-wo-bg.png',
        scrolledSrc: undefined,
        alt: 'Digifly logo – digitalt konsulenthus med fokus på AI, automatisering og skalering',
        maxWidth: 150,
    },

    border: {
        enabled: false,
        widthPx: 1,
        colorHex: '#000000',
        color: { h: 0, s: 0, l: 0, opacity: 100 },
    },

    bg: {
        initial: { h: 0, s: 0, l: 100, opacity: 100 },
        scrolled: { h: 0, s: 0, l: 100, opacity: 100 },
    },

    navLinks: [],
    cta: {
        enabled: true,
        label: 'Book et møde',
        linkType: 'external',
        href: 'https://calendly.com/okh-digifly/30min',
        variant: 'pill',
        size: 'lg',
        mobileFloating: { enabled: false, position: 'br', offsetX: 16, offsetY: 16 },
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
};

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings | null> => {
    
    function normalizeHeader(h?: Partial<HeaderSettings>): HeaderSettings {
        const overlay = typeof h?.isOverlay === "boolean" ? h.isOverlay : headerDefaults.isOverlay;
        const sticky = typeof h?.headerIsSticky === "boolean" ? h.headerIsSticky : headerDefaults.headerIsSticky;
        const height = typeof h?.headerHeight === "number" ? h.headerHeight : headerDefaults.headerHeight;
        const logoWidth = typeof h?.headerLogoWidth === "number" ? h.headerLogoWidth : headerDefaults.headerLogoWidth;
        const linkColor = h?.headerLinkColor ?? headerDefaults.headerLinkColor;

        const border = {
            enabled: h?.border?.enabled ?? headerDefaults.border.enabled,
            widthPx: (h?.border as any)?.widthPx ?? (headerDefaults.border as any).widthPx,
            color: {
            h: h?.border?.color?.h ?? headerDefaults.border.color.h,
            s: h?.border?.color?.s ?? headerDefaults.border.color.s,
            l: h?.border?.color?.l ?? headerDefaults.border.color.l,
            opacity: (h?.border?.color as any)?.opacity ?? headerDefaults.border.color.opacity,
            },
            colorHex: (h?.border as any)?.colorHex,
        };

        const bg = {
            initial: {
                h: (h?.topBg as any)?.h ?? headerDefaults.bg.initial.h,
                s: (h?.topBg as any)?.s ?? headerDefaults.bg.initial.s,
                l: (h?.topBg as any)?.l ?? headerDefaults.bg.initial.l,
                opacity: (h?.topBg as any)?.opacity ?? headerDefaults.bg.initial.opacity,
            },
            scrolled: {
                h: (h?.scrolledBg as any)?.h ?? headerDefaults.bg.scrolled.h,
                s: (h?.scrolledBg as any)?.s ?? headerDefaults.bg.scrolled.s,
                l: (h?.scrolledBg as any)?.l ?? headerDefaults.bg.scrolled.l,
                opacity: (h?.scrolledBg as any)?.opacity ?? headerDefaults.bg.scrolled.opacity,
            },
        };
        
        const logo = {
            src: h?.logo?.src ?? headerDefaults.logo.src,
            scrolledSrc: h?.logo?.scrolledSrc ?? headerDefaults.logo.scrolledSrc,
            alt: h?.logo?.alt ?? headerDefaults.logo.alt,
            maxWidth: h?.logo?.maxWidth ?? headerDefaults.logo.maxWidth,
        };

        const cta = {
            enabled: h?.cta?.enabled ?? headerDefaults.cta.enabled,
            label: h?.cta?.label ?? headerDefaults.cta.label,
            linkType: h?.cta?.linkType ?? headerDefaults.cta.linkType,
            href: h?.cta?.href ?? headerDefaults.cta.href,
            variant: h?.cta?.variant ?? headerDefaults.cta.variant,
            size: h?.cta?.size ?? headerDefaults.cta.size,
            mobileFloating: {
                enabled: h?.cta?.mobileFloating?.enabled ?? headerDefaults.cta.mobileFloating.enabled,
                position: h?.cta?.mobileFloating?.position ?? headerDefaults.cta.mobileFloating.position,
                offsetX: h?.cta?.mobileFloating?.offsetX ?? headerDefaults.cta.mobileFloating.offsetX,
                offsetY: h?.cta?.mobileFloating?.offsetY ?? headerDefaults.cta.mobileFloating.offsetY,
            },
        };

      return { ...headerDefaults, isOverlay: overlay, headerIsSticky: sticky, headerHeight: height, headerLogoWidth: logoWidth, logo, linkColor, border, topBg: bg.initial, scrolledBg: bg.scrolled, navLinks: h?.navLinks ?? [], cta } as any;
    }

    try {
      const ref = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
      const snap = await ref.get();
      if (!snap.exists) return null;
      const data = snap.data() as GeneralSettings;
      const header = normalizeHeader(data?.header ?? {});
      return { ...data, header };
    } catch {
      return null;
    }
  },
  ['general-settings'],
  { revalidate: false }
);

export async function saveGeneralSettings(settings: Partial<GeneralSettings>): Promise<{ success: boolean; message: string }> {
  try {
    const ref = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
    const patch: any = { ...settings };
    await ref.set(patch, { merge: true });
    return { success: true, message: 'Settings saved.' };
  } catch (error) {
    console.error('Error saving general settings: ', error);
    return { success: false, message: 'Could not save settings.' };
  }
}
