
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { ReactNode, Suspense } from "react";
import { getGeneralSettings } from "@/services/settings";
import type { Brand } from "@/types/settings";
import FooterClient from "@/components/layout/FooterClient";
import Template from "./template";
import SiteHeader from "@/components/site/SiteHeader";
import { getHeaderAppearance } from "@/lib/server/header";


export default async function PublicLayout({ children }: { children: ReactNode }) {
  noStore();

  const [settings, headerAppearance] = await Promise.all([
    getGeneralSettings(),
    getHeaderAppearance()
  ]);

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
            <SiteHeader appearance={headerAppearance} settings={settings} />
            <main className="flex-1">{children}</main>
            {(footerTheme.enabled ?? true) && (
                <Suspense fallback={<footer></footer>}>
                    <FooterClient brand={publicBrand} theme={footerTheme} />
                </Suspense>
            )}
        </Template>
    </div>
  );
}
