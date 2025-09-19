
'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import AnnouncementBanner from '@/components/announcement-banner';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import type { GeneralSettings } from '@/types/settings';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { mapToCssVars } from '@/lib/design/mapToCssVars';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};


export default function Template({ children, settings }: { children: ReactNode, settings: GeneralSettings | null }) {
    const {
        cookieConsent,
        showBanner,
        handleAcceptAll,
        handleAcceptNecessary,
        handleSaveConsent,
    } = useCookieConsent(settings);
    
    const [showCookieSettings, setShowCookieSettings] = useState(false);
    
    useEffect(() => {
        if (!getApps().length) initializeApp(firebaseConfig);
        const db = getFirestore();
        const ref = doc(db, 'settings/general');
        const unsub = onSnapshot(ref, (snap) => {
          const data = (snap.data() || {}) as any;
          const vars = mapToCssVars(data.header, data.buttonSettings, data.themeColors);
          const root = document.documentElement;
          for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, String(v));
          window.dispatchEvent(new CustomEvent('design:updated', { detail: data }));
        });

        const openCookieSettingsHandler = () => setShowCookieSettings(true);
        window.addEventListener('open-cookie-settings', openCookieSettingsHandler);

        return () => {
            unsub();
            window.removeEventListener('open-cookie-settings', openCookieSettingsHandler);
        };
    }, []);

    const fixedConsent = cookieConsent
      ? { ...cookieConsent, necessary: true as const }
      : null;

    return (
        <>
            <AnnouncementBanner />
            <main>
                {children}
            </main>
            <Suspense fallback={null}>
                <MobileFloatingCTA settings={settings} />
            </Suspense>
            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} onOpenCookieSettings={() => setShowCookieSettings(true)} />
            </Suspense>

            {showBanner && (
                <CookieBanner 
                    settings={settings?.cookies || null}
                    onAcceptAll={handleAcceptAll}
                    onAcceptNecessary={handleAcceptNecessary}
                    onCustomize={() => {
                        setShowCookieSettings(true);
                    }}
                />
            )}
            
            <CookieSettingsModal
                isOpen={showCookieSettings}
                onOpenChange={setShowCookieSettings}
                settings={settings?.cookies || null}
                onSave={handleSaveConsent}
                initialConsent={fixedConsent ?? { necessary: true, preferences: false, analytics: false, marketing: false }}
            />
            
            <Analytics consent={fixedConsent} settings={settings} />
            <Toaster />
        </>
    )
}
