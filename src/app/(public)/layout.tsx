'use client';

import { ReactNode, useState } from 'react';
import { Header } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { GeneralSettings, NavLink } from '@/types/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';
import CookieBanner from '@/components/cookies/CookieBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { getWebsiteHeaderConfig } from '@/services/website.server';
import type { WebsiteHeaderConfig } from '@/services/website';

export default function PublicLayout({
  children,
  settings,
  headerConfig,
}: {
  children: ReactNode;
  settings: GeneralSettings | null;
  headerConfig: WebsiteHeaderConfig;
}) {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const { cookieConsent, showBanner, handleAcceptAll, handleAcceptNecessary, handleSaveConsent } = useCookieConsent(settings);

  return (
    <ThemeProvider settings={settings}>
      <Header
        settings={settings}
        navLinks={headerConfig.navLinks}
        heightPx={headerConfig.heightPx}
        logoUrl={headerConfig.logoUrl}
        logoAlt={settings?.logoAlt ?? 'Digifly'}
        logoWidthPx={headerConfig.logoWidthPx}
        sticky={headerConfig.sticky}
        linkClass={headerConfig.linkClass}
      />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer settings={settings} onOpenCookieSettings={() => setShowCookieSettings(true)} />
      </div>
      <MobileFloatingCTA settings={settings} />

      {showBanner && (
        <CookieBanner
          settings={settings?.cookies || null}
          onAcceptAll={handleAcceptAll}
          onAcceptNecessary={handleAcceptNecessary}
          onCustomize={() => setShowCookieSettings(true)}
        />
      )}
      <CookieSettingsModal
        isOpen={showCookieSettings}
        onOpenChange={setShowCookieSettings}
        settings={settings?.cookies || null}
        onSave={handleSaveConsent}
        initialConsent={cookieConsent}
      />
    </ThemeProvider>
  );
}
