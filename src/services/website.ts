import { getGeneralSettings } from "@/services/settings";
import type { NavLink } from "@/types/settings";

export type HslA = { h: number; s: number; l: number; opacity: number };
export type WebsiteHeaderConfig = {
  sticky: boolean;
  heightPx: number;
  logoWidthPx: number;
  linkClass: string;
  logoUrl?: string;
  navLinks: NavLink[];
  topBg: HslA;
  scrolledBg: HslA;
};

function linkClassFromInput(color?: string) {
  if (!color) return "text-black hover:text-primary";
  return `${color} hover:text-primary`;
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  const s = await getGeneralSettings();

  const header = (s as any)?.header ?? {};
  const sticky = header.sticky ?? s?.headerIsSticky ?? true;
  const heightPx = header.height ?? s?.headerHeight ?? 80;
  const logoWidthPx = header.logo?.maxWidth ?? s?.headerLogoWidth ?? 120;

  const topBg = {
    h: header.bg?.initial?.h ?? s?.headerInitialBackgroundColor?.h ?? 0,
    s: header.bg?.initial?.s ?? s?.headerInitialBackgroundColor?.s ?? 0,
    l: header.bg?.initial?.l ?? s?.headerInitialBackgroundColor?.l ?? 100,
    opacity: Math.round((header.bg?.initial?.opacity ?? (s?.headerInitialBackgroundOpacity ?? 100) / 100) * 100),
  };

  const scrolledBg = {
    h: header.bg?.scrolled?.h ?? s?.headerScrolledBackgroundColor?.h ?? 0,
    s: header.bg?.scrolled?.s ?? s?.headerScrolledBackgroundColor?.s ?? 0,
    l: header.bg?.scrolled?.l ?? s?.headerScrolledBackgroundColor?.l ?? 100,
    opacity: Math.round((header.bg?.scrolled?.opacity ?? (s?.headerScrolledBackgroundOpacity ?? 100) / 100) * 100),
  };

  const logoUrl = s?.logoUrl ?? header.logo?.src ?? undefined;
  const linkClass = linkClassFromInput(s?.headerLinkColor);
  const navLinks = Array.isArray(s?.headerNavLinks) ? s!.headerNavLinks : (header.navLinks ?? []);

  return {
    sticky,
    heightPx,
    logoWidthPx,
    linkClass,
    logoUrl,
    navLinks,
    topBg,
    scrolledBg,
  };
}
