
'use client';

import { ReactNode, Suspense } from 'react';
import Footer from '@/components/layout/footer';
import Analytics from '@/components/analytics';
import { Toaster } from '@/components/ui/toaster';
import AnnouncementBanner from '@/components/announcement-banner';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import type { GeneralSettings } from '@/types/settings';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';


export default function Template({ children, settings }: { children: ReactNode, settings: GeneralSettings | null }) {
    const {
        cookieConsent,
        showBanner,
        showSettings,
        handleAcceptAll,
        handleAcceptNecessary,
        handleSaveConsent,
        setShowSettings,
    } = useCookieConsent(settings);
    
    return (
        <>
            <AnnouncementBanner />
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
                        setShowSettings(true);
                    }}
                />
            )}
            
            <CookieSettingsModal
                isOpen={showSettings}
                onOpenChange={setShowSettings}
                settings={settings?.cookies || null}
                onSave={handleSaveConsent}
                initialConsent={cookieConsent}
            />
            
            <Analytics consent={cookieConsent} settings={settings} />
            <Toaster />
        </>
    )
}
