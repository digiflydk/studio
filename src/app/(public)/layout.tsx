import { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import { getAdminHeader } from '@/services/admin.server';
import type { WebsiteHeaderConfig } from '@/services/website.server';


export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, headerData] = await Promise.all([
    getGeneralSettings(),
    getAdminHeader(),
  ]);

  const headerConfig: WebsiteHeaderConfig = {
    heightPx: headerData?.height ?? 80,
    sticky: headerData?.sticky ?? true,
    overlay: headerData?.overlay ?? false,
    logo: {
      src: headerData?.logo?.src,
      alt: headerData?.logo?.alt,
      maxWidth: headerData?.logo?.maxWidth,
    },
    navLinks: headerData?.nav ?? [],
    cta: headerData?.cta,
    bg: headerData?.bg,
    border: headerData?.border,
    linkColor: headerData?.linkColor,
  }

  return (
    <ThemeProvider settings={settings}>
      <SiteHeader />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
