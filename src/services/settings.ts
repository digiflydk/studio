
'use server';

import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings, HeaderSettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';

/**
 * Default header-opsætning — UDEN 'bg'
 * (Matcher HeaderSettings fra '@/types/settings')
 */
const headerDefaults: HeaderSettings = {
    isOverlay: false,
    headerIsSticky: true,
    headerHeight: 80,
    headerLogoWidth: 150,
    headerLinkColor: 'black',
    headerLinkColorHex: undefined,
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
    // CTA DEFINED → fjerner “possibly undefined”
    cta: {
        enabled: true,
        label: 'Book et møde',
        linkType: 'external',
        href: 'https://calendly.com/okh-digifly/30min',
        variant: 'pill',
        size: 'lg',
        mobileFloating: { enabled: false, position: 'br', offsetX: 16, offsetY: 16 },
    },
    navLinks: [],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
};

export const getGeneralSettings = unstable_cache(
  async (): Promise<GeneralSettings | null> => {
    try {
      const ref = adminDb.collection(SETTINGS_COLLECTION_ID).doc(SETTINGS_DOC_ID);
      const snap = await ref.get();
      if (!snap.exists) return null;
      const data = snap.data() as GeneralSettings;
      // You can add normalization here if needed, similar to buildHeaderSettings
      return data;
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
