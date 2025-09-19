'use client';

import { useState, Suspense, ReactNode } from 'react';
import { getGeneralSettings } from "@/services/settings";
import type { Brand, GeneralSettings } from "@/types/settings";
import FooterClient from "@/components/layout/FooterClient";
import Template from "./template";
import SiteHeader from "@/components/site/SiteHeader";
import { getHeaderAppearance } from "@/lib/server/header";
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

  const publicBrand: Brand = {
    id: "public-page-brand",
    name: settings?.websiteTitle || "Digifly",
    slug: "",
    logoUrl: settings?.logoUrl || "/digifly-logo-dark.svg",
    companyName: "",
    ownerId: "",
    status: "active",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    currency: "",
    companyRegNo: "",
    foodCategories: [],
    locationsCount: 0,
  };

  const footerTheme = settings?.footer ?? {};
  const footerStyle: React.CSSProperties = {
    "--of-footer-bg": footerTheme.bg ?? "#0b0b0b",
    "--of-footer-text": footerTheme.textColor ?? "#e5e7eb",
  } as React.CSSProperties;


  return (
    <div className="flex min-h-screen flex-col bg-[#f3f7fd]" style={footerStyle}>
        <Template settings={settings}>
            <SiteHeader appearance={null} settings={settings} />
            <main className="flex-1">{children}</main>
            {(footerTheme.enabled ?? true) && (
                 <Suspense fallback={<footer></footer>}>
                    <Footer settings={settings} onOpenCookieSettings={() => setCookieOpen(true)} />
                </Suspense>
            )}
        </Template>
        <CookieSettingsModal
            isOpen={cookieOpen}
            onOpenChange={setCookieOpen}
            settings={settings?.cookies || null}
            onSave={() => {}}
            initialConsent={{ necessary: true, preferences: false, analytics: false, marketing: false }}
        />
    </div>
  );
}
