import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getGeneralSettings } from "@/services/settings";
import { ThemeProvider } from "@/context/ThemeContext";

type AnyObj = Record<string, any>;

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();
  const header: AnyObj = ((settings as AnyObj)?.header ?? {}) as AnyObj;

  const navLinks =
    (Array.isArray((header as AnyObj).navLinks) && (header as AnyObj).navLinks.length > 0
      ? (header as AnyObj).navLinks
      : (settings as AnyObj)?.headerNavLinks) || [];

  const headerHeight =
    (header as AnyObj).height ?? (settings as AnyObj)?.headerHeight ?? 80;

  const logoUrl =
    (settings as AnyObj)?.logoUrl ?? (header as AnyObj)?.logo?.src ?? undefined;

  const logoAlt =
    (settings as AnyObj)?.logoAlt ?? (header as AnyObj)?.logo?.alt ?? "Digifly";

  const logoWidth =
    (header as AnyObj)?.logo?.maxWidth ??
    (settings as AnyObj)?.headerLogoWidth ??
    150;

  const sticky =
    (header as AnyObj)?.sticky ?? (settings as AnyObj)?.headerIsSticky ?? true;

  return (
    <ThemeProvider settings={settings}>
      <Header
        settings={settings}
        navLinks={navLinks}
        heightPx={headerHeight}
        logoUrl={logoUrl || undefined}
        logoAlt={logoAlt}
        logoWidthPx={logoWidth}
        sticky={!!sticky}
        linkClass="text-black hover:text-primary"
      />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </div>
    </ThemeProvider>
  );
}
