
'use server';

import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

const headerDefaults: HeaderSettings = {
  overlay: true,
  sticky: true,
  height: 72,
  logo: { maxWidth: 140 },
  linkColor: 'white',
  border: { enabled: false, width: 1, color: { h: 220, s: 13, l: 91 } },
  bg: {
    initial: { h: 0, s: 0, l: 100, opacity: 1 },
    scrolled: { h: 210, s: 100, l: 95, opacity: 0.98 },
  },
  navLinks: [
    { label: 'Online ordre', href: '/#online-orders' },
    { label: 'Priser', href: '/#pricing' },
    { label: 'Kunder', href: '/#customers' },
    { label: 'Kontakt', href: '/#contact' },
  ],
};

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings | null> => {

    function normalizeHeader(h?: Partial<HeaderSettings>): HeaderSettings {
      const overlay = typeof h?.isOverlay === "boolean" ? h.isOverlay : (headerDefaults as any).isOverlay;
      const sticky = typeof h?.sticky === "boolean" ? h.sticky : headerDefaults.sticky;
      const height = typeof h?.height === "number" ? h.height : headerDefaults.height;
      const linkColor = h?.linkColor ?? headerDefaults.linkColor;

      const border = {
        enabled: h?.border?.enabled ?? headerDefaults.border.enabled,
        width: (h?.border as any)?.widthPx ?? headerDefaults.border.width,
        color: {
          h: h?.border?.color?.h ?? headerDefaults.border.color.h,
          s: h?.border?.color?.s ?? headerDefaults.border.color.s,
          l: h?.border?.color?.l ?? headerDefaults.border.color.l,
        },
        colorHex: (h?.border as any)?.colorHex,
      };

      const bg = {
        initial: {
          h: h?.bg?.initial?.h ?? headerDefaults.bg.initial.h,
          s: h?.bg?.initial?.s ?? headerDefaults.bg.initial.s,
          l: h?.bg?.initial?.l ?? headerDefaults.bg.initial.l,
          opacity: h?.bg?.initial?.opacity ?? headerDefaults.bg.initial.opacity,
        },
        scrolled: {
          h: h?.bg?.scrolled?.h ?? headerDefaults.bg.scrolled.h,
          s: h?.bg?.scrolled?.s ?? headerDefaults.bg.scrolled.s,
          l: h?.bg?.scrolled?.l ?? headerDefaults.bg.scrolled.l,
          opacity: h?.bg?.scrolled?.opacity ?? headerDefaults.bg.scrolled.opacity,
        },
      };

      const logo = {
        src: h?.logo?.src ?? (headerDefaults.logo as any).src,
        scrolledSrc: (h?.logo as any)?.scrolledSrc ?? (headerDefaults.logo as any).scrolledSrc,
        alt: h?.logo?.alt ?? (headerDefaults.logo as any).alt,
        maxWidth: h?.logo?.maxWidth ?? headerDefaults.logo.maxWidth,
      };

      const cta = {
        enabled: h?.cta?.enabled ?? (headerDefaults as any).cta.enabled,
        label: h?.cta?.label ?? (headerDefaults as any).cta.label,
        linkType: h?.cta?.linkType ?? (headerDefaults as any).cta.linkType,
        href: h?.cta?.href ?? (headerDefaults as any).cta.href,
        variant: h?.cta?.variant ?? (headerDefaults as any).cta.variant,
        size: h?.cta?.size ?? (headerDefaults as any).cta.size,
        mobileFloating: {
          enabled: h?.cta?.mobileFloating?.enabled ?? (headerDefaults as any).cta.mobileFloating.enabled,
          position: h?.cta?.mobileFloating?.position ?? (headerDefaults as any).cta.mobileFloating.position,
          offsetX: h?.cta?.mobileFloating?.offsetX ?? (headerDefaults as any).cta.mobileFloating.offsetX,
          offsetY: h?.cta?.mobileFloating?.offsetY ?? (headerDefaults as any).cta.mobileFloating.offsetY,
        },
      };

      return { isOverlay: overlay, sticky, height, logo, linkColor, border, bg, navLinks: h?.navLinks ?? [], cta } as any;
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

    // This function is no longer available here, and logic is handled inside getGeneralSettings
    // if (patch.header) {
    //   const normalized = normalizeHeader(patch.header);
    //   patch.header = normalized;
    // }

    await ref.set(patch, { merge: true });
    return { success: true, message: 'Settings saved.' };
  } catch (error) {
    console.error('Error saving general settings: ', error);
    return { success: false, message: 'Could not save settings.' };
  }
}
