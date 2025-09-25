import "server-only";
import { getGeneralSettings } from '@/services/settings';
import { getCmsHeaderDoc } from '@/services/cmsHeader';

export type Hsl = { h: number; s: number; l: number; opacity: number };
export type WebsiteHeaderConfig = {
  heightPx: number;
  sticky: boolean;
  logoWidthPx: number;
  logoUrl?: string;
  logoAlt?: string;
  navLinks: { label: string; href: string }[];
  linkClass: string;
  topBg: Hsl;
  scrolledBg: Hsl;
  border: { enabled: boolean; widthPx: number; colorHex: string };
};

function pickLinkClass(color?: string) {
  if (!color) return 'text-black hover:text-gray-700';
  const c = color.toLowerCase();
  if (c.includes('white')) return 'text-white hover:text-gray-200';
  if (c.includes('black')) return 'text-black hover:text-gray-700';
  return 'text-foreground hover:text-muted-foreground';
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  const settings = await getGeneralSettings();
  const cms = await getCmsHeaderDoc();
  const a = (cms?.appearance as any) ?? {};

  const heightPx =
    a.headerHeight ??
    settings?.headerHeight ??
    80;

  const sticky =
    a.headerIsSticky ??
    settings?.headerIsSticky ??
    true;

  const logoWidthPx =
    a.headerLogoWidth ??
    settings?.headerLogoWidth ??
    120;

  const logoUrl =
    a.logo?.src ??
    settings?.logoUrl ??
    undefined;

  const logoAlt =
    a.logo?.alt ??
    settings?.logoAlt ??
    'Digifly';

  const navLinks: { label: string; href: string }[] =
    Array.isArray(a.navLinks) && a.navLinks.length > 0
      ? a.navLinks
      : Array.isArray(settings?.headerNavLinks)
      ? settings!.headerNavLinks
      : [];

  const topBg: Hsl = {
    h: a.topBg?.h ?? settings?.headerInitialBackgroundColor?.h ?? 0,
    s: a.topBg?.s ?? settings?.headerInitialBackgroundColor?.s ?? 0,
    l: a.topBg?.l ?? settings?.headerInitialBackgroundColor?.l ?? 100,
    opacity: a.topBg?.opacity ?? (settings?.headerInitialBackgroundOpacity ?? 100) / 100,
  };

  const scrolledBg: Hsl = {
    h: a.scrolledBg?.h ?? settings?.headerScrolledBackgroundColor?.h ?? topBg.h,
    s: a.scrolledBg?.s ?? settings?.headerScrolledBackgroundColor?.s ?? topBg.s,
    l: a.scrolledBg?.l ?? settings?.headerScrolledBackgroundColor?.l ?? topBg.l,
    opacity: a.scrolledBg?.opacity ?? (settings?.headerScrolledBackgroundOpacity ?? 100) / 100,
  };

  const border = {
    enabled: a.border?.enabled ?? a.border?.visible ?? true,
    widthPx: a.border?.widthPx ?? settings?.headerTopBorderHeight ?? 1,
    colorHex: a.border?.colorHex ?? '#000000',
  };

  const linkClass = pickLinkClass(a.headerLinkColor ?? settings?.headerLinkColor);

  return {
    heightPx,
    sticky,
    logoWidthPx,
    logoUrl,
    logoAlt,
    navLinks,
    linkClass,
    topBg,
    scrolledBg,
    border,
  };
}
