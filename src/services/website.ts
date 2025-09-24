
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { getGeneralSettings } from "@/services/settings";
import { getCmsHeaderDoc } from "@/services/cmsHeader";
import { linkClassFromInput } from "@/lib/colors";
import type { NavLink } from '@/types/settings';

export type HSL = { h: number, s: number, l: number, opacity: number };

export interface WebsiteHeaderConfig {
  isOverlay: boolean;
  sticky: boolean;
  heightPx: number;
  logoWidthPx: number;
  topBg: HSL;
  scrolledBg: HSL;
  linkClass: string;
  logoUrl?: string;
  navLinks: NavLink[];
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const [cms, fallback] = await Promise.all([getCmsHeaderDoc(), getGeneralSettings()]);
  const a = cms?.appearance as any;

  if (a) {
    return {
      isOverlay: !!a.isOverlay,
      sticky: !!a.headerIsSticky,
      heightPx: a.headerHeight ?? 80,
      logoWidthPx: a.headerLogoWidth ?? a.logo?.maxWidth ?? 120,
      topBg: {
        h: a.topBg?.h ?? 0,
        s: a.topBg?.s ?? 0,
        l: a.topBg?.l ?? 100,
        opacity: a.topBg?.opacity ?? 0,
      },
      scrolledBg: {
        h: a.scrolledBg?.h ?? 210,
        s: a.scrolledBg?.s ?? 100,
        l: a.scrolledBg?.l ?? 95,
        opacity: a.scrolledBg?.opacity ?? 98,
      },
      linkClass: linkClassFromInput(a.headerLinkColorHex ?? a.headerLinkColor, a.headerLinkColorHex),
      logoUrl: a.logo?.src,
      navLinks: a.navLinks || [],
    };
  }

  const fallbackHeader = fallback?.header ?? {};

  return {
    isOverlay: true,
    sticky: fallbackHeader?.sticky ?? true,
    heightPx: fallbackHeader?.height ?? 80,
    logoWidthPx: fallbackHeader?.logo?.maxWidth ?? 120,
    topBg: {
      h: (fallbackHeader as any)?.bg?.initial?.h ?? 0,
      s: (fallbackHeader as any)?.bg?.initial?.s ?? 0,
      l: (fallbackHeader as any)?.bg?.initial?.l ?? 100,
      opacity: (fallbackHeader as any)?.bg?.initial?.opacity * 100 ?? 0,
    },
    scrolledBg: {
      h: (fallbackHeader as any)?.bg?.scrolled?.h ?? 210,
      s: (fallbackHeader as any)?.bg?.scrolled?.s ?? 100,
      l: (fallbackHeader as any)?.bg?.scrolled?.l ?? 95,
      opacity: (fallbackHeader as any)?.bg?.scrolled?.opacity * 100 ?? 98,
    },
    linkClass: linkClassFromInput(fallbackHeader?.linkColor),
    logoUrl: fallbackHeader?.logo?.src,
    navLinks: fallbackHeader?.navLinks || [],
  };
}
