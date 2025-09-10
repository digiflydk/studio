'use client';

import { ReactNode, Suspense, useRef, useLayoutEffect, useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import AnnouncementBanner from '@/components/announcement-banner';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { getConsent, saveConsent } from '@/lib/cookie-consent';
import type { ConsentCategories, GeneralSettings } from '@/types/settings';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import { getGeneralSettings } from '@/services/settings';

export default function Template({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const { settings: headerSettings } = useHeaderSettings(settings?.headerCtaSettings);
    const headerRef = useRef<HTMLElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const [cookieConsent, setCookieConsent] = useState<ConsentCategories | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
      async function loadSettings() {
        const s = await getGeneralSettings();
        setSettings(s);
      }
      loadSettings();
    }, []);

    useEffect(() => {
        if (!settings) return;
        const consent = getConsent();
        if (consent) {
            setCookieConsent(consent);
            setShowBanner(false);
        } else {
            setShowBanner(true);
            // Set initial consent to defaults from CMS or fallback
            setCookieConsent({
                necessary: true,
                preferences: settings?.cookies?.defaults.preferences ?? false,
                analytics: settings?.cookies?.defaults.analytics ?? false,
                marketing: settings?.cookies?.defaults.marketing ?? false,
            })
        }
    }, [settings]);


    useLayoutEffect(() => {
        const headerEl = headerRef.current;
        const bannerEl = bannerRef.current;
        if (!headerEl) return;

        const applyOffset = () => {
            const headerH = headerEl.getBoundingClientRect().height ?? 0;
            const bannerH = bannerEl?.getBoundingClientRect().height ?? 0;
            const totalOffset = Math.max(0, headerH + bannerH);

            const root = document.documentElement;
            root.style.setProperty('--header-offset', `${totalOffset}px`);
            document.body.style.paddingTop = `var(--header-offset)`;
            root.style.scrollPaddingTop = `calc(var(--header-offset) + 16px)`; // 16px buffer for anchor links
        }

        applyOffset();

        const resizeObserver = new ResizeObserver(applyOffset);
        if(headerEl) resizeObserver.observe(headerEl);
        if(bannerEl) resizeObserver.observe(bannerEl);
        
        window.addEventListener('resize', applyOffset);
        window.addEventListener('orientationchange', applyOffset);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', applyOffset);
            window.removeEventListener('orientationchange', applyOffset);
        }
    }, [settings]); // Re-run if settings change, which might affect header/banner
    
    const handleSaveConsent = (consent: ConsentCategories) => {
        const lifetime = settings?.cookies?.consentLifetimeDays ?? 180;
        saveConsent(consent, lifetime);
        setCookieConsent(consent);
        setShowBanner(false);
        setShowSettings(false);
    }
    
    const handleAcceptAll = () => {
        handleSaveConsent({ necessary: true, preferences: true, analytics: true, marketing: true });
    }
    
    const handleAcceptNecessary = () => {
         handleSaveConsent({ necessary: true, preferences: false, analytics: false, marketing: false });
    }
    
    const initialConsent = cookieConsent || {
        necessary: true,
        preferences: settings?.cookies?.defaults.preferences ?? false,
        analytics: settings?.cookies?.defaults.analytics ?? false,
        marketing: settings?.cookies?.defaults.marketing ?? false,
    };

    return (
        <>
            <Header ref={headerRef} settings={settings} />
            <AnnouncementBanner ref={bannerRef} />
            <main>
                {children}
            </main>
            <Suspense fallback={null}>
                <MobileFloatingCTA />
            </Suspense>
            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} onOpenCookieSettings={() => setShowSettings(true)} />
            </Suspense>

            {showBanner && (
                <CookieBanner 
                    settings={settings?.cookies || null}
                    onAcceptAll={handleAcceptAll}
                    onAcceptNecessary={handleAcceptNecessary}
                    onCustomize={() => {
                        setShowBanner(false);
                        setShowSettings(true);
                    }}
                />
            )}
            
            <CookieSettingsModal
                isOpen={showSettings}
                onOpenChange={setShowSettings}
                settings={settings?.cookies || null}
                onSave={handleSaveConsent}
                initialConsent={initialConsent}
            />
            
            <Analytics consent={cookieConsent} settings={settings} />
            <Toaster />
        </>
    )
}
