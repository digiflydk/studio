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
import { doc, onSnapshot } from 'firebase/firestore';
import { getDb } from '@/lib/client/firebase';
import { mapToCssVars } from '@/lib/design/mapToCssVars';


export default function Template({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const {
        cookieConsent,
        showBanner,
        handleAcceptAll,
        handleAcceptNecessary,
        handleSaveConsent,
    } = useCookieConsent(settings);
    
    const [showCookieSettings, setShowCookieSettings] = useState(false);
    
    useEffect(() => {
        const _db = getDb();
        const ref = doc(_db, 'settings/general');
        const unsub = onSnapshot(ref, (snap) => {
          const data = (snap.data() || {}) as GeneralSettings;
          setSettings(data);
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
            <main className="flex-1">
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
