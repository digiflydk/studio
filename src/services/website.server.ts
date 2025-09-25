import "server-only";
import { getGeneralSettings } from "@/services/settings";

export type WebsiteHeaderConfig = {
  sticky: boolean;
  heightPx: number;
  logoWidthPx: number;
  linkClass: string;
  logoUrl?: string;
  navLinks: { label: string; href: string }[];
  border: {
    enabled: boolean;
    widthPx: number;
    colorHex: string;
    color: { h: number; s: number; l: number; opacity: number };
  };
  topBg: { h: number; s: number; l: number; opacity: number };
  scrolledBg: { h: number; s: number; l: number; opacity: number };
};

function normalizeOpacity(v: number | undefined) {
  if (v == null) return 100;
  if (v <= 1) return Math.round(v * 100);
  return Math.round(v);
}

function linkClassFromInput(c?: string) {
  if (!c) return "text-black hover:text-gray-700";
  return c.includes("white")
    ? "text-white hover:text-gray-200"
    : "text-black hover:text-gray-700";
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  const g = await getGeneralSettings();
  const header = (g as any)?.header ?? {};
  const initial = header?.bg?.initial ?? { h: 0, s: 0, l: 100, opacity: 1 };
  const scrolled = header?.bg?.scrolled ?? { h: 0, s: 0, l: 100, opacity: 1 };
  const border = header?.border ?? {};
  const borderColor = border?.color ?? { h: 0, s: 0, l: 0, opacity: 100 };

  return {
    sticky: header?.sticky ?? g?.headerIsSticky ?? true,
    heightPx: header?.height ?? g?.headerHeight ?? 80,
    logoWidthPx: header?.logo?.maxWidth ?? g?.headerLogoWidth ?? 120,
    linkClass: linkClassFromInput(header?.linkColor ?? g?.headerLinkColor),
    logoUrl: header?.logo?.src ?? g?.logoUrl,
    navLinks: Array.isArray(header?.navLinks) ? header.navLinks : g?.headerNavLinks ?? [],
    border: {
      enabled: !!border?.enabled,
      widthPx: Number(border?.width ?? border?.widthPx ?? 1),
      colorHex: border?.colorHex ?? "#000000",
      color: {
        h: Number(borderColor?.h ?? 0),
        s: Number(borderColor?.s ?? 0),
        l: Number(borderColor?.l ?? 0),
        opacity: normalizeOpacity(borderColor?.opacity),
      },
    },
    topBg: {
      h: Number(initial?.h ?? 0),
      s: Number(initial?.s ?? 0),
      l: Number(initial?.l ?? 100),
      opacity: normalizeOpacity(initial?.opacity),
    },
    scrolledBg: {
      h: Number(scrolled?.h ?? 0),
      s: Number(scrolled?.s ?? 0),
      l: Number(scrolled?.l ?? 100),
      opacity: normalizeOpacity(scrolled?.opacity),
    },
  };
}
