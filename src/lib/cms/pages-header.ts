import { adminDb } from '@/lib/server/firebaseAdmin';
import type { HeaderCTASettings } from '@/types/settings';
import { unstable_cache } from 'next/cache';

const PATH = 'pages/header';

export const headerDefaults: HeaderCTASettings = {
  enabled: false,
  label: 'Kom i gang',
  linkType: 'internal',
  href: '#hero',
  variant: 'default',
  size: 'default',
  mobileFloating: { enabled: false, position: 'br', offsetX: 16, offsetY: 16 },
};

export const getHeaderSettings = unstable_cache(
    async (): Promise<HeaderCTASettings> => {
        try {
            const snap = await adminDb.doc(PATH).get();
            if (snap.exists) {
                return { ...headerDefaults, ...(snap.data() as any) };
            }
            return headerDefaults;
        } catch (error) {
            console.error("Error fetching header settings:", error);
            return headerDefaults;
        }
    },
    ['pages:header'],
    {
        tags: ['pages:header'],
    }
);

export async function saveHeaderSettings(input: HeaderCTASettings) {
  await adminDb.doc(PATH).set(input, { merge: true });
  const fresh = await adminDb.doc(PATH).get();
  return fresh.data() as HeaderCTASettings;
}
