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

function hexToHsl(hex: string) {
  let h = 0, s = 0, l = 0;
  const rhex = hex.replace("#", "");
  const full = rhex.length === 6 ? rhex : rhex.split("").map(ch => ch + ch).join("");
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  l = (max + min) / 2;
  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function toHslFromAny(c: any, fallback: { h: number; s: number; l: number; opacity: number }) {
  if (!c) return fallback;
  if (typeof c.hex === "string") {
    const hs = hexToHsl(c.hex);
    const opacity = typeof c.opacity === "number" ? c.opacity : typeof (c as any).a === "number" ? (c as any).a : fallback.opacity;
    return { ...hs, opacity };
  }
  const h = typeof c.h === "number" ? c.h : fallback.h;
  const s = typeof c.s === "number" ? c.s : fallback.s;
  const l = typeof c.l === "number" ? c.l : fallback.l;
  const opacity = typeof c.opacity === "number" ? c.opacity : fallback.opacity;
  return { h, s, l, opacity };
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const data = await getGeneralSettings();

  const src = (data?.header && (data?.header as any).appearance) ? (data.header as any).appearance : data || {};

  const top = src.topBg || {
    h: src.headerInitialBackgroundColor?.h,
    s: src.headerInitialBackgroundColor?.s,
    l: src.headerInitialBackgroundColor?.l,
    opacity: src.headerInitialBackgroundOpacity,
  };

  const scrolled = src.scrolledBg || {
    h: src.headerScrolledBackgroundColor?.h,
    s: src.headerScrolledBackgroundColor?.s,
    l: src.headerScrolledBackgroundColor?.l,
    opacity: src.headerScrolledBackgroundOpacity,
  };

  const topBg = toHslFromAny(top, { h: 0, s: 0, l: 100, opacity: 0 });
  const scrolledBg = toHslFromAny(scrolled, { h: 210, s: 100, l: 95, opacity: 98 });

  return {
    isOverlay: src.isOverlay ?? true,
    sticky: src.headerIsSticky ?? true,
    heightPx: src.headerHeight ?? 80,
    logoWidthPx: src.headerLogoWidth ?? 120,
    topBg,
    scrolledBg,
    linkClass: resolveLinkClass(src.headerLinkColor),
  };
}
