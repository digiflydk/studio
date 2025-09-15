"use server";

import { unstable_noStore as noStore } from "next/cache";
import type { WebsiteHeaderConfig } from "@/types/website";
import { getGeneralSettings } from "./settings";

function resolveLinkClass(input?: string): string {
  const v = (input || "").toLowerCase().trim();
  switch (v) {
    case "black":
    case "sort":
      return "text-black hover:text-black/70";
    case "white":
    case "hvid":
      return "text-white hover:text-white/80";
    case "primary":
    case "brand":
      return "text-primary hover:text-primary/80";
    case "secondary":
      return "text-secondary hover:text-secondary/80";
    default:
      return "text-white hover:text-primary";
  }
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const data = await getGeneralSettings();
  const h = data?.header;

  return {
    isOverlay: h?.overlay ?? true,
    sticky: h?.sticky ?? true,
    heightPx: h?.height ?? 80,
    logoWidthPx: h?.logo?.maxWidth ?? 120,
    topBg: {
      h: h?.bg?.initial?.h ?? 0,
      s: h?.bg?.initial?.s ?? 0,
      l: h?.bg?.initial?.l ?? 100,
      opacity: Math.round(((h?.bg?.initial?.opacity ?? 1) * 100)),
    },
    scrolledBg: {
      h: h?.bg?.scrolled?.h ?? 210,
      s: h?.bg?.scrolled?.s ?? 100,
      l: h?.bg?.scrolled?.l ?? 95,
      opacity: Math.round(((h?.bg?.scrolled?.opacity ?? 0.98) * 100)),
    },
    linkClass: resolveLinkClass(h?.linkColor),
  };
}
