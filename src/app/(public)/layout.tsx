
import { ReactNode } from 'react';
import HeaderClient from '@/components/layout/HeaderClient';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import { getAdminHeader } from '@/services/admin.server';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, header] = await Promise.all([getGeneralSettings(), getAdminHeader()]);

  // Basic mapping for now
  const headerConfig = header ? {
    heightPx: header.height,
    sticky: header.sticky,
    overlay: header.overlay,
    linkColor: header.linkColor,
    navLinks: header.nav,
    logo: header.logo,
    bg: header.bg,
    border: {
        enabled: header.border.enabled,
        widthPx: header.border.widthPx,
        colorHex: header.border.colorHex
    },
    cta: header.cta
  } : await (async () => {
      const s = await getGeneralSettings();
      const legacyHeader = (s as any)?.header ?? {};
      return {
        heightPx: legacyHeader.height ?? 80,
        sticky: legacyHeader.sticky ?? true,
        overlay: legacyHeader.overlay ?? false,
        linkColor: legacyHeader.linkColor ?? 'black',
        navLinks: legacyHeader.navLinks ?? [],
        logo: legacyHeader.logo ?? { src: '/logo.svg', alt: 'logo', maxWidth: 150 },
        bg: legacyHeader.bg ?? { initial: {h: 0, s: 0, l: 100, opacity: 1}, scrolled: {h: 0, s: 0, l: 100, opacity: 1}},
        border: legacyHeader.border,
        cta: legacyHeader.cta
      }
  })();

  return (
    <ThemeProvider settings={settings}>
      <HeaderClient config={headerConfig} />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
