
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { HeaderCTASettings } from '@/lib/validators/headerSettings.zod';
import { unstable_cache } from 'next/cache';

const PATH = 'pages/header';

export const getHeaderSettings = unstable_cache(
    async (): Promise<HeaderCTASettings> => {
        const db = adminDb;
        const headerDefaults: HeaderCTASettings = {
          enabled: false,
          label: 'Kom i gang',
          linkType: 'internal',
          href: '#hero',
          variant: 'default',
          size: 'default',
          mobileFloating: { enabled: false, position: 'br', offsetX: 16, offsetY: 16 },
        };
        try {
            const snap = await db.doc(PATH).get();
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
