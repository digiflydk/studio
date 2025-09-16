"use server";
import { unstable_noStore as noStore } from "next/cache";
import type { WebsiteHeaderConfig } from "@/types/website";
import { getGeneralSettings } from "@/services/settings";
import { getCmsHeader } from "@/services/cmsHeader";
import { linkClassFromInput } from "@/lib/colors";

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const [cms, fallback] = await Promise.all([getCmsHeader(), getGeneralSettings()]);
  const a = cms?.appearance;

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
      linkClass: linkClassFromInput(a.link?.hex ? a.link?.hex : a.link?.color, a.link?.hex),
    };
  }

  return {
    isOverlay: true,
    sticky: fallback?.headerIsSticky ?? true,
    heightPx: fallback?.headerHeight ?? 80,
    logoWidthPx: fallback?.headerLogoWidth ?? 120,
    topBg: {
      h: fallback?.headerInitialBackgroundColor?.h ?? 0,
      s: fallback?.headerInitialBackgroundColor?.s ?? 0,
      l: fallback?.headerInitialBackgroundColor?.l ?? 100,
      opacity: fallback?.headerInitialBackgroundOpacity ?? 0,
    },
    scrolledBg: {
      h: fallback?.headerScrolledBackgroundColor?.h ?? 210,
      s: fallback?.headerScrolledBackgroundColor?.s ?? 100,
      l: fallback?.headerScrolledBackgroundColor?.l ?? 95,
      opacity: fallback?.headerScrolledBackgroundOpacity ?? 98,
    },
    linkClass: linkClassFromInput(fallback?.headerLinkColor),
  };
}
