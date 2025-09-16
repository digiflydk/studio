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

function pick<T>(...vals: Array<T | null | undefined>) {
  for (const v of vals) if (v !== undefined && v !== null) return v as T;
  return undefined as any;
}

function normalizeBg(src: any, fallback: { h: number; s: number; l: number; opacity: number }) {
  if (!src) return fallback;
  if (typeof src.hex === "string") {
    return { ...hexToHsl(src.hex), opacity: typeof src.opacity === "number" ? src.opacity : fallback.opacity };
  }
  const h = pick<number>(src.h);
  const s = pick<number>(src.s);
  const l = pick<number>(src.l);
  const opacity = pick<number>(src.opacity, src.a);
  return {
    h: typeof h === "number" ? h : fallback.h,
    s: typeof s === "number" ? s : fallback.s,
    l: typeof l === "number" ? l : fallback.l,
    opacity: typeof opacity === "number" ? opacity : fallback.opacity,
  };
}

function hexToHsl(hex: string) {
  const s = hex.replace("#", "");
  const full = s.length === 6 ? s : s.split("").map(c => c + c).join("");
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, ss = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    ss = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(ss * 100), l: Math.round(l * 100) };
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  noStore();
  const s = await getGeneralSettings();

  const topCandidate = pick<any>(
    s?.header?.bg?.initial,
    s?.topBg,
    s?.headerInitialBackgroundColor ? { ...s.headerInitialBackgroundColor, opacity: s?.headerInitialBackgroundOpacity } : null
  );
  const scrolledCandidate = pick<any>(
    s?.header?.bg?.scrolled,
    s?.scrolledBg,
    s?.headerScrolledBackgroundColor ? { ...s.headerScrolledBackgroundColor, opacity: s?.headerScrolledBackgroundOpacity } : null
  );

  const topBg = normalizeBg(topCandidate, { h: 0, s: 0, l: 100, opacity: 0 });
  const scrolledBg = normalizeBg(scrolledCandidate, { h: 210, s: 100, l: 95, opacity: 98 });

  const heightPx = pick<number>(s?.header?.height, s?.headerHeight, 80);
  const logoWidthPx = pick<number>(s?.header?.logo?.maxWidth, s?.headerLogoWidth, 120);
  const sticky = pick<boolean>(s?.headerIsSticky, true);
  const isOverlay = pick<boolean>(s?.isOverlay, true);
  const linkClass = resolveLinkClass(s?.headerLinkColor);

  return {
    isOverlay,
    sticky,
    heightPx,
    logoWidthPx,
    topBg,
    scrolledBg,
    linkClass,
  };
}
