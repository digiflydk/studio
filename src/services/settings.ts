
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

function to01(v: unknown, fb = 1): number {
  if (typeof v === 'number') {
    if (v >= 0 && v <= 1) return v;
    if (v > 1 && v <= 100) return Math.max(0, Math.min(1, v / 100));
  }
  return fb;
}

function normHsl(input: any, fb: { h: number; s: number; l: number }) {
  const h = typeof input?.h === 'number' ? input.h : fb.h;
  const s = typeof input?.s === 'number' ? input.s : fb.s;
  const l = typeof input?.l === 'number' ? input.l : fb.l;
  return { h, s, l };
}

function normHsla(input: any, fb: { h: number; s: number; l: number; opacity: number }) {
  const base = normHsl(input, fb);
  const opacity = to01(input?.opacity, fb.opacity);
  return { ...base, opacity };
}

function normalizeHeader(h: any): HeaderSettings {
  const overlay = h?.overlay ?? headerDefaults.overlay;
  const sticky = h?.sticky ?? headerDefaults.sticky;
  const height = typeof h?.height === 'number' ? h.height : headerDefaults.height;
  const logo = { maxWidth: typeof h?.logo?.maxWidth === 'number' ? h.logo.maxWidth : headerDefaults.logo.maxWidth };
  const linkColor = h?.linkColor ?? headerDefaults.linkColor;
  const border = {
    enabled: h?.border?.enabled ?? headerDefaults.border.enabled,
    width: typeof h?.border?.width === 'number' ? h.border.width : headerDefaults.border.width,
    color: normHsl(h?.border?.color, headerDefaults.border.color),
  };
  const bg = {
    initial: normHsla(h?.bg?.initial, headerDefaults.bg.initial),
    scrolled: normHsla(h?.bg?.scrolled, headerDefaults.bg.scrolled),
  };
  const navLinks = Array.isArray(h?.navLinks) ? h.navLinks : headerDefaults.navLinks;
  return { overlay, sticky, height, logo, linkColor, border, bg, navLinks };
}

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings | null> => {
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

    if (patch.header) {
      const normalized = normalizeHeader(patch.header);
      patch.header = normalized;
    }

    await ref.set(patch, { merge: true });
    return { success: true, message: 'Settings saved.' };
  } catch (error) {
    console.error('Error saving general settings: ', error);
    return { success: false, message: 'Could not save settings.' };
  }
}
