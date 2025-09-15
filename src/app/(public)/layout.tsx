export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { ReactNode, Suspense } from "react";
import { getGeneralSettings } from "@/services/settings";
import { getWebsiteHeaderConfig } from "@/services/website";
import type { Brand } from "@/types/settings";
import HeaderClient from "@/components/layout/HeaderClient";
import FooterClient from "@/components/layout/FooterClient";
import Template from "./template";


export default async function PublicLayout({ children }: { children: ReactNode }) {
  noStore();

  const [settings, headerConfig] = await Promise.all([
    getGeneralSettings(),
    getWebsiteHeaderConfig(),
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
            <HeaderClient brand={publicBrand} settings={settings} config={headerConfig} />
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