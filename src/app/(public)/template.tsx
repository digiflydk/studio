
'use client';

import { ReactNode, Suspense, useRef, useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import AnnouncementBanner from '@/components/announcement-banner';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { getConsent, saveConsent } from '@/lib/cookie-consent';
import type { ConsentCategories, GeneralSettings, NavLink } from '@/types/settings';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Template({ children, settings }: { children: ReactNode, settings: GeneralSettings | null }) {
    const headerRef = useRef<HTMLElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);
    const [cookieConsent, setCookieConsent] = useState<ConsentCategories | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
    
    const navLinks = settings?.headerNavLinks && settings.headerNavLinks.length > 0 
    ? settings.headerNavLinks 
    : defaultNavLinks;

    return (
        <>
            <Header 
                ref={headerRef} 
                links={navLinks} 
                logoUrl={settings?.logoUrl}
                logoAlt={settings?.logoAlt}
            />
            <AnnouncementBanner ref={bannerRef} />
            <main className="pt-16">
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
