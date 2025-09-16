
// src/services/header.ts
export type Appearance = {
  isOverlay: boolean;
  headerIsSticky: boolean;
  headerHeight: number;
  headerLogoWidth: number;
  headerLinkColor: string;
  border: {
    enabled: boolean;
    widthPx: number;
    color: { h: number; s: number; l: number };
  };
  topBg: { h: number; s: number; l: number; opacity: number };
  scrolledBg: { h: number; s: number; l: number; opacity: number };
  navLinks: { label: string; href: string }[];
};

type ApiResponse =
  | { ok: true; data: { appearance?: Partial<Appearance> } | Record<string, any> }
  | { ok: false; error: string; message?: string };

function hsl(h: number, s: number, l: number, a?: number) {
  if (typeof a === "number") return `hsla(${h} ${s}% ${l}% / ${a / 100})`;
  return `hsl(${h} ${s}% ${l}%)`;
}

function toAppearance(raw: any): Appearance {
  const a = raw?.appearance ?? raw ?? {};
  const border = a.border ?? {};
  const top = a.topBg ?? {};
  const scr = a.scrolledBg ?? {};
  return {
    isOverlay: !!a.isOverlay,
    headerIsSticky: !!a.headerIsSticky,
    headerHeight: Number(a.headerHeight ?? 72),
    headerLogoWidth: Number(a.headerLogoWidth ?? 140),
    headerLinkColor: a.headerLinkColor ?? "white",
    border: {
      enabled: !!(border.enabled ?? border.visible),
      widthPx: Number(border.widthPx ?? border.width ?? 1),
      color: {
        h: Number(border?.color?.h ?? 220),
        s: Number(border?.color?.s ?? 13),
        l: Number(border?.color?.l ?? 91),
      },
    },
    topBg: {
      h: Number(top.h ?? 0),
      s: Number(top.s ?? 0),
      l: Number(top.l ?? 100),
      opacity: Number(top.opacity ?? 0),
    },
    scrolledBg: {
      h: Number(scr.h ?? 210),
      s: Number(scr.s ?? 100),
      l: Number(scr.l ?? 95),
      opacity: Number(scr.opacity ?? 98),
    },
    navLinks: Array.isArray(a.navLinks) ? a.navLinks : [],
  };
}

export async function fetchHeaderAppearance(): Promise<Appearance> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/pages/header/appearance`, {
    cache: "no-store",
    headers: { "content-type": "application/json" },
  });
  const json: ApiResponse = await res.json();
  if (!("ok" in json) || !json.ok) {
    // Fallback til defaults
    return toAppearance({});
  }
  return toAppearance(json.data);
}

export function computeHeaderStyles(a: Appearance) {
  return {
    root: {
      position: a.headerIsSticky ? "sticky" as const : "relative" as const,
      top: 0,
      height: `${a.headerHeight}px`,
      background: hsl(a.topBg.h, a.topBg.s, a.topBg.l, a.topBg.opacity),
      borderBottom: a.border.enabled
        ? `${a.border.widthPx}px solid ${hsl(a.border.color.h, a.border.color.s, a.border.color.l)}`
        : "none",
    },
    scrolledBg: hsl(a.scrolledBg.h, a.scrolledBg.s, a.scrolledBg.l, a.scrolledBg.opacity),
    linkColor: a.headerLinkColor || "white",
    logoMaxWidth: `${a.headerLogoWidth}px`,
  };
}
