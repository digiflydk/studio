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
  const header = data?.header || {};
  return {
    isOverlay: true,
    sticky: header.sticky ?? true,
    heightPx: header.height ?? 80,
    logoWidthPx: header.logo?.maxWidth ?? 120,
    topBg: {
      h: header.bg?.initial?.h ?? 0,
      s: header.bg?.initial?.s ?? 0,
      l: header.bg?.initial?.l ?? 100,
      opacity: header.bg?.initial?.opacity !== undefined ? header.bg.initial.opacity * 100 : 0,
    },
    scrolledBg: {
      h: header.bg?.scrolled?.h ?? 210,
      s: header.bg?.scrolled?.s ?? 100,
      l: header.bg?.scrolled?.l ?? 95,
      opacity: header.bg?.scrolled?.opacity !== undefined ? header.bg.scrolled.opacity * 100 : 98,
    },
    linkClass: resolveLinkClass(data?.headerLinkColor),
  };
}
