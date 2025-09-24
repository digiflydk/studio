'use client';

import { ReactNode, useState } from "react";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { GeneralSettings } from "@/types/settings";
import { ThemeProvider } from "@/context/ThemeContext";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function PublicLayout({
  children,
  settings,
}: {
  children: ReactNode;
  settings: GeneralSettings | null;
}) {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const { cookieConsent } = useCookieConsent(settings);
  const navLinks = (settings?.headerNavLinks as any) ?? [];
  const headerHeight = settings?.headerHeight ?? 80;
  const logoUrl = settings?.logoUrl ?? undefined;
  const logoAlt = settings?.logoAlt ?? undefined;
  const logoWidth = settings?.headerLogoWidth ?? 150;
  const sticky = settings?.headerIsSticky ?? true;

  const fixedConsent = cookieConsent
    ? { ...cookieConsent, necessary: true as const }
    : null;

  return (
    <ThemeProvider settings={settings}>
      <Header
        settings={settings}
        navLinks={navLinks}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        heightPx={headerHeight}
        logoWidthPx={logoWidth}
        sticky={sticky}
      />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer settings={settings} onOpenCookieSettings={() => setShowCookieSettings(true)} />
      </div>
      <CookieSettingsModal
          isOpen={showCookieSettings}
          onOpenChange={setShowCookieSettings}
          settings={settings?.cookies || null}
          onSave={() => {}}
          initialConsent={fixedConsent ?? { necessary: true, preferences: false, analytics: false, marketing: false }}
      />
    </ThemeProvider>
  );
}