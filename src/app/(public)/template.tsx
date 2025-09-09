
'use client';

import { ReactNode, Suspense, useRef, useLayoutEffect, useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import { useGeneralSettings } from '@/hooks/use-general-settings';
import { ThemeProvider } from '@/context/ThemeContext';
import AnnouncementBanner from '@/components/announcement-banner';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { getConsent, saveConsent } from '@/lib/cookie-consent';
import { ConsentCategories, CookieSettings } from '@/types/settings';
import { Button } from '@/components/ui/button';

export default function Template({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    const headerRef = useRef<HTMLElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const [cookieConsent, setCookieConsent] = useState<ConsentCategories | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
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

        const headerH = headerEl.getBoundingClientRect().height ?? 0;
        const bannerH = bannerEl?.getBoundingClientRect().height ?? 0;
        const totalOffset = Math.max(0, headerH + bannerH);

        const root = document.documentElement;
        root.style.setProperty('--header-offset', `${totalOffset}px`);
        root.style.scrollPaddingTop = `${totalOffset + 8}px`; // 8px luft
    }, []);
    
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
        <ThemeProvider settings={settings}>
            <Header ref={headerRef} settings={settings} />
            <AnnouncementBanner ref={bannerRef} />
            <main>
                {children}
            </main>

            <Suspense fallback={<footer></footer>}>
                <Footer settings={settings} />
            </Suspense>
            
            <div className="fixed bottom-4 right-4 z-50">
                <Button variant="secondary" size="sm" onClick={() => setShowSettings(true)}>
                    Cookie-indstillinger
                </Button>
            </div>

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
            
            <Analytics settings={settings} />
            <Toaster />
        </ThemeProvider>
    )
}
