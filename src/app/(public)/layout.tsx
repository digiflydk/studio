'use client';

import { useState, Suspense, ReactNode } from 'react';
import type { GeneralSettings } from "@/types/settings";
import Template from "./template";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from '@/components/layout/footer';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';

export default function PublicLayout({
  children,
  settings,
}: {
  children: ReactNode;
  settings: GeneralSettings | null;
}) {
  const [cookieOpen, setCookieOpen] = useState(false);

  const footerTheme = settings?.footer ?? {};
  const footerStyle: React.CSSProperties = {
    "--of-footer-bg": footerTheme.bg ?? "#0b0b0b",
    "--of-footer-text": footerTheme.textColor ?? "#e5e7eb",
  } as React.CSSProperties;


  return (
    <div className="flex min-h-screen flex-col bg-[#f3f7fd]" style={footerStyle}>
        <Template settings={settings}>
            <SiteHeader />
            <main className="flex-1">{children}</main>
        </Template>
         <Footer settings={settings} onOpenCookieSettings={() => setCookieOpen(true)} />
        <CookieSettingsModal
            isOpen={cookieOpen}
            onOpenChange={setCookieOpen}
            settings={settings?.cookies ?? null}
            onSave={() => {}}
            initialConsent={{ necessary: true, preferences: false, analytics: false, marketing: false }}
        />
    </div>
  );
}
