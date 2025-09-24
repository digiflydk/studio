'use client';

import { ReactNode, useState } from "react";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import type { GeneralSettings, NavLink } from "@/types/settings";
import { ThemeProvider } from "@/context/ThemeContext";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";

export default function PublicLayout({
  children,
  settings,
}: {
  children: ReactNode;
  settings: GeneralSettings | null;
}) {
  const [cookieOpen, setCookieOpen] = useState(false);

  const header = settings?.header ?? {};
  const navLinks: NavLink[] =
    (header.navLinks && header.navLinks.length > 0
      ? header.navLinks
      : settings?.headerNavLinks) ?? [];

  const headerHeight = header.height ?? settings?.headerHeight ?? 80;
  const logoUrl = settings?.logoUrl ?? header.logo?.src ?? undefined;
  const logoAlt = settings?.logoAlt ?? header.logo?.alt ?? "Digifly";
  const logoWidth = header.logo?.maxWidth ?? settings?.headerLogoWidth ?? 150;
  const sticky = header.sticky ?? settings?.headerIsSticky ?? true;

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
        <Footer settings={settings} onOpenCookieSettings={() => setCookieOpen(true)} />
      </div>
       <CookieSettingsModal
        isOpen={cookieOpen}
        onOpenChange={setCookieOpen}
        settings={settings?.cookies || null}
        onSave={() => {}}
        initialConsent={{ necessary: true, preferences: false, analytics: false, marketing: false }}
      />
    </ThemeProvider>
  );
}
