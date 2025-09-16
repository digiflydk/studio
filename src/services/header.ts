// src/services/header.ts
export type Appearance = {
  isOverlay: boolean;
  headerIsSticky: boolean;
  headerHeight: number;
  headerLogoWidth: number;
  headerLinkColor?: string;
  headerLinkColorHex?: string;
  logo?: { src?: string; scrolledSrc?: string; alt?: string; maxWidth?: number };
  border: {
    enabled: boolean;
    widthPx: number;
    color?: { h: number; s: number; l: number };
    colorHex?: string;
  };
  topBg: { h: number; s: number; l: number; opacity: number; hex?: string };
  scrolledBg: { h: number; s: number; l: number; opacity: number; hex?: string };
  navLinks: { label: string; href: string }[];
};

type ApiResponse =
  | { ok: true; data: { appearance?: Partial<Appearance> } | Record<string, any> }
  | { ok: false; error: string; message?: string };

function hsl(h: number, s: number, l: number, a?: number) {
  if (typeof a === "number") return `hsla(${h} ${s}% ${l}% / ${a / 100})`;
  return `hsl(${h} ${s}% ${l}%)`;
}

function hex(hex?: string, opacity?: number) {
  if (!hex) return undefined;
  // Hvis der er 8 tegn (RGBA) respekteres alpha fra hex; ellers bruger vi evt. opacity-procent
  if (hex.length === 9) return hex; // #RRGGBBAA
  if (typeof opacity === "number" && opacity < 100) {
    // CSS tillader ikke #RRGGBB + separat alpha direkte, så vi lader opacity håndteres via HSLA fallback.
    return hex;
  }
  return hex;
}

export function toAppearance(raw: any): Appearance {
  const a = raw?.appearance ?? raw ?? {};
  const border = a.border ?? {};
  const top = a.topBg ?? {};
  const scr = a.scrolledBg ?? {};
  return {
    isOverlay: !!a.isOverlay,
    headerIsSticky: !!a.headerIsSticky,
    headerHeight: Number(a.headerHeight ?? 72),
    headerLogoWidth: Number(a.headerLogoWidth ?? a?.logo?.maxWidth ?? 140),
    headerLinkColor: a.headerLinkColor,
    headerLinkColorHex: a.headerLinkColorHex ?? a.link?.hex,
    logo: { src: a.logo?.src, scrolledSrc: a.logo?.scrolledSrc, alt: a.logo?.alt, maxWidth: a.logo?.maxWidth },
    border: {
      enabled: !!(border.enabled ?? border.visible),
      widthPx: Number(border.widthPx ?? border.width ?? 1),
      color: border.color,
      colorHex: border.colorHex,
    },
    topBg: {
      h: Number(top.h ?? 0),
      s: Number(top.s ?? 0),
      l: Number(top.l ?? 100),
      opacity: Number(top.opacity ?? 0),
      hex: top.hex,
    },
    scrolledBg: {
      h: Number(scr.h ?? 210),
      s: Number(scr.s ?? 100),
      l: Number(scr.l ?? 95),
      opacity: Number(scr.opacity ?? 98),
      hex: scr.hex,
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
  if (!("ok" in json) || !json.ok) return toAppearance({});
  return toAppearance(json.data);
}

export function computeHeaderStyles(a: Appearance) {
  const topBgCss =
    (a.topBg.hex ? a.topBg.hex : undefined) ??
    // hsl fallback
    `hsla(${a.topBg.h} ${a.topBg.s}% ${a.topBg.l}% / ${a.topBg.opacity / 100})`;

  const scrBgCss =
    (a.scrolledBg.hex ? a.scrolledBg.hex : undefined) ??
    `hsla(${a.scrolledBg.h} ${a.scrolledBg.s}% ${a.scrolledBg.l}% / ${a.scrolledBg.opacity / 100})`;

  const linkColorCss = a.headerLinkColorHex ?? a.headerLinkColor ?? "white";
  const borderColorCss =
    a.border.colorHex ??
    (a.border.color
      ? `hsl(${a.border.color.h} ${a.border.color.s}% ${a.border.color.l}%)`
      : undefined);

  return {
    root: {
      position: a.headerIsSticky ? ("sticky" as const) : ("relative" as const),
      top: 0,
      // VIGTIGT: sørg for at headeren altid ligger over indhold
      zIndex: 1000,
      // Skab ny stacking context på headeren
      // (z-index virker kun på positionerede elementer; sticky er OK)
      background: topBgCss,
      height: `${a.headerHeight}px`,
      borderBottom: a.border.enabled
        ? `${a.border.widthPx}px solid ${borderColorCss ?? "transparent"}`
        : "none",
      // (valgfrit men ufarligt) GPU-hint hjælper mod repaint-glitches ved scroll
      willChange: "transform",
    },
    scrolledBg: scrBgCss,
    linkColor: linkColorCss,
    logoMaxWidth: `${a.headerLogoWidth}px`,
    logoSrc: a.logo?.src ?? "/logo.svg",
    logoScrolledSrc: a.logo?.scrolledSrc ?? a.logo?.src ?? "/logo.svg",
    logoAlt: a.logo?.alt ?? "Logo",
  };
}
