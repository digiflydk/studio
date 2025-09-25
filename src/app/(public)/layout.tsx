import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { getGeneralSettings } from '@/services/settings';
import { getWebsiteHeaderConfig } from '@/services/website.server';
import { ThemeProvider } from '@/context/ThemeContext';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();
  const headerCfg = await getWebsiteHeaderConfig();

  const navLinks =
    (Array.isArray(settings?.headerNavLinks) ? settings?.headerNavLinks : undefined) ??
    (Array.isArray(headerCfg?.navLinks) ? headerCfg?.navLinks : []) ??
    [];

  const logoUrl = settings?.logoUrl ?? headerCfg?.logoUrl ?? null;
  const logoAlt = settings?.logoAlt ?? settings?.companyName ?? 'Digifly';
  const heightPx = headerCfg?.heightPx ?? settings?.headerHeight ?? 80;
  const logoWidthPx = headerCfg?.logoWidthPx ?? settings?.headerLogoWidth ?? 120;
  const sticky = headerCfg?.sticky ?? settings?.headerIsSticky ?? true;
  const linkClass = headerCfg?.linkClass ?? 'text-black hover:text-primary';

  return (
    <ThemeProvider settings={settings}>
      <Header
        settings={settings}
        brand={undefined}
        logoUrl={logoUrl}
        logoAlt={logoAlt}
        navLinks={navLinks}
        linkClass={linkClass}
        heightPx={heightPx}
        logoWidthPx={logoWidthPx}
        sticky={sticky}
      />
      {children}
    </ThemeProvider>
  );
}
