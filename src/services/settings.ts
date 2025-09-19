
'use server';

import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

const headerDefaults: HeaderSettings = {
  isOverlay: false,
  headerIsSticky: true,
  headerHeight: 72,
  headerLogoWidth: 140,
  headerLinkColor: 'black',
  logo: { src: '', scrolledSrc: '', alt: 'Logo', maxWidth: 140 },
  border: { enabled: false, widthPx: 1, color: { h: 220, s: 13, l: 91, opacity: 100 } },
  topBg: { h: 0, s: 0, l: 100, opacity: 1 },
  scrolledBg: { h: 0, s: 0, l: 100, opacity: 1 },
  navLinks: [],
  version: 0,
  updatedAt: '',
  updatedBy: '',
};

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings | null> => {
    function normalizeHeader(h?: Partial<HeaderSettings>): HeaderSettings {
        const overlay = typeof h?.isOverlay === "boolean" ? h.isOverlay : headerDefaults.isOverlay;
        const sticky = typeof h?.headerIsSticky === "boolean" ? h.headerIsSticky : headerDefaults.headerIsSticky;
        const height = typeof h?.headerHeight === "number" ? h.headerHeight : headerDefaults.headerHeight;
        const linkColor = h?.headerLinkColor ?? headerDefaults.headerLinkColor;

        const border = {
            enabled: h?.border?.enabled ?? headerDefaults.border.enabled,
            widthPx: (h?.border as any)?.widthPx ?? (headerDefaults.border as any).widthPx,
            color: {
            h: h?.border?.color?.h ?? headerDefaults.border.color.h,
            s: h?.border?.color?.s ?? headerDefaults.border.color.s,
            l: h?.border?.color?.l ?? headerDefaults.border.color.l,
            opacity: h?.border?.color?.opacity ?? headerDefaults.border.color.opacity,
            },
            colorHex: (h?.border as any)?.colorHex,
        };

        const bg = {
            initial: {
            h: (h?.topBg as any)?.h ?? headerDefaults.topBg.h,
            s: (h?.topBg as any)?.s ?? headerDefaults.topBg.s,
            l: (h?.topBg as any)?.l ?? headerDefaults.topBg.l,
            opacity: (h?.topBg as any)?.opacity ?? headerDefaults.topBg.opacity,
            },
            scrolled: {
            h: (h?.scrolledBg as any)?.h ?? headerDefaults.scrolledBg.h,
            s: (h?.scrolledBg as any)?.s ?? headerDefaults.scrolledBg.s,
            l: (h?.scrolledBg as any)?.l ?? headerDefaults.scrolledBg.l,
            opacity: (h?.scrolledBg as any)?.opacity ?? headerDefaults.scrolledBg.opacity,
            },
        };
        
        const logo = {
            src: h?.logo?.src ?? headerDefaults.logo.src,
            scrolledSrc: h?.logo?.scrolledSrc ?? headerDefaults.logo.scrolledSrc,
            alt: h?.logo?.alt ?? headerDefaults.logo.alt,
            maxWidth: h?.logo?.maxWidth ?? headerDefaults.logo.maxWidth,
        };

      return { isOverlay: overlay, headerIsSticky: sticky, headerHeight: height, logo, headerLinkColor: linkColor, border, topBg: bg.initial, scrolledBg: bg.scrolled, navLinks: h?.navLinks ?? [] } as any;
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
