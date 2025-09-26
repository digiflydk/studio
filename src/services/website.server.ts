
import "server-only";
import { getGeneralSettings } from '@/services/settings';
import { getCmsHeaderDoc } from '@/services/cmsHeader';
import type { HeaderCTASettings } from "@/types/settings";


export type Hsl = { h: number; s: number; l: number; opacity: number };
export type WebsiteHeaderConfig = {
  heightPx: number;
  sticky: boolean;
  logoWidthPx: number;
  logoUrl?: string;
  logoScrolledUrl?: string;
  logoAlt?: string;
  navLinks: { label: string; href: string }[];
  linkClass: string;
  topBg: Hsl;
  scrolledBg: Hsl;
  border: { enabled: boolean; widthPx: number; colorHex: string };
  cta?: HeaderCTASettings;
};

function pickLinkClass(color?: string) {
  if (!color) return 'text-black hover:text-gray-700';
  const c = color.toLowerCase();
  if (c.includes('white')) return 'text-white hover:text-gray-200';
  if (c.includes('black')) return 'text-black hover:text-gray-700';
  return 'text-foreground hover:text-muted-foreground';
}

function normalizeOpacity(v: number | undefined) {
    if (v == null) return 1;
    if (v > 1) return v / 100;
    return v;
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  const settings = await getGeneralSettings();
  const cms = await getCmsHeaderDoc();
  const a = (cms?.appearance as any) ?? {};

  const heightPx =
    a.headerHeight ??
    settings?.header?.height ??
    80;

  const sticky =
    a.headerIsSticky ??
    settings?.header?.sticky ??
    true;

  const logoWidthPx =
    a.headerLogoWidth ??
    a.logo?.maxWidth ??
    settings?.header?.logo?.maxWidth ??
    150;

  const logoUrl =
    a.logo?.src ??
    settings?.logoUrl ??
    undefined;
  
  const logoScrolledUrl = 
    (a.logo as any)?.scrolledSrc ??
    (settings as any)?.logoScrolledUrl ??
    logoUrl;

  const logoAlt =
    a.logo?.alt ??
    settings?.logoAlt ??
    'Digifly';

  const navLinks: { label: string; href: string }[] =
    Array.isArray(a.navLinks) && a.navLinks.length > 0
      ? a.navLinks
      : Array.isArray(settings?.header?.navLinks)
      ? settings!.header!.navLinks
      : [];

  const topBg: Hsl = {
    h: a.topBg?.h ?? settings?.header?.bg?.initial?.h ?? 0,
    s: a.topBg?.s ?? settings?.header?.bg?.initial?.s ?? 0,
    l: a.topBg?.l ?? settings?.header?.bg?.initial?.l ?? 100,
    opacity: normalizeOpacity(a.topBg?.opacity ?? settings?.header?.bg?.initial?.opacity),
  };

  const scrolledBg: Hsl = {
    h: a.scrolledBg?.h ?? settings?.header?.bg?.scrolled?.h ?? topBg.h,
    s: a.scrolledBg?.s ?? settings?.header?.bg?.scrolled?.s ?? topBg.s,
    l: a.scrolledBg?.l ?? settings?.header?.bg?.scrolled?.l ?? topBg.l,
    opacity: normalizeOpacity(a.scrolledBg?.opacity ?? settings?.header?.bg?.scrolled?.opacity),
  };

  const border = {
    enabled: a.border?.enabled ?? a.border?.visible ?? settings?.header?.border?.enabled ?? true,
    widthPx: a.border?.widthPx ?? settings?.header?.border?.width ?? 1,
    colorHex: a.border?.colorHex ?? '#000000',
  };

  const linkClass = pickLinkClass(a.headerLinkColor ?? settings?.headerLinkColor);
  
  const cta = settings?.header?.cta;

  return {
    heightPx,
    sticky,
    logoWidthPx,
    logoUrl,
    logoScrolledUrl,
    logoAlt,
    navLinks,
    linkClass,
    topBg,
    scrolledBg,
    border,
    cta,
  };
}
