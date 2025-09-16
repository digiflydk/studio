"use server";
import { unstable_noStore as noStore } from "next/cache";
import type { WebsiteHeaderConfig } from "@/types/website";
import { getGeneralSettings } from "@/services/settings";
import { getCmsHeaderPage } from "@/services/cms";
import { linkClassFromInput } from "@/lib/colors";

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const [settings, header] = await Promise.all([getGeneralSettings(), getCmsHeaderPage()]);

  const h = header ?? {
    isOverlay: true,
    headerIsSticky: true,
    headerHeight: 80,
    headerLogoWidth: 120,
    headerLinkColor: "white",
    topBg: { h: 0, s: 0, l: 100, opacity: 0 },
    scrolledBg: { h: 210, s: 100, l: 95, opacity: 98 },
    navLinks: settings?.headerNavLinks ?? [],
  };

  return {
    isOverlay: !!h.isOverlay,
    sticky: !!h.headerIsSticky,
    heightPx: h.headerHeight ?? 80,
    logoWidthPx: h.headerLogoWidth ?? 120,
    topBg: {
      h: h.topBg?.h ?? 0,
      s: h.topBg?.s ?? 0,
      l: h.topBg?.l ?? 100,
      opacity: h.topBg?.opacity ?? 0,
    },
    scrolledBg: {
      h: h.scrolledBg?.h ?? 210,
      s: h.scrolledBg?.s ?? 100,
      l: h.scrolledBg?.l ?? 95,
      opacity: h.scrolledBg?.opacity ?? 98,
    },
    linkClass: linkClassFromInput(h.headerLinkColor),
  };
}
