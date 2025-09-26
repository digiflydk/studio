import { getGeneralSettingsServer } from "@/services/settings.server";
import { getCmsHeaderAppearanceServer } from "@/services/cms.server";
import { HeaderSettingsZ, type HeaderSettings } from "@/lib/validators/header.zod";

function normalizeOpacity(v: number | undefined | null) {
  if (v == null) return 1;
  return v <= 1 ? v : Math.max(0, Math.min(1, v / 100));
}

function pickNum(...vals: Array<number | undefined>): number | undefined {
  for (const v of vals) if (typeof v === "number") return v;
  return undefined;
}

export type WebsiteHeaderConfig = {
  heightPx: number;
  sticky: boolean;
  overlay?: boolean;
  linkClass?: string;
  logoUrl?: string;
  logoAlt?: string;
  logoWidthPx?: number;
  logoScrolledUrl?: string;
  bg: {
    top: { h: number; s: number; l: number; opacity: number };
    scrolled: { h: number; s: number; l: number; opacity: number };
  };
  border: {
    enabled: boolean;
    widthPx: number;
    color: { h: number; s: number; l: number; opacity?: number };
    colorHex?: string;
  };
  navLinks: { label: string; href: string }[];
  cta?: { enabled?: boolean; label?: string; href?: string };
};

function parseHeader(input: unknown): HeaderSettings | null {
  const res = HeaderSettingsZ.safeParse(input);
  return res.success ? res.data : null;
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  // Hent datakilder
  const settings = await getGeneralSettingsServer().catch(() => null);
  const cmsRaw = await getCmsHeaderAppearanceServer().catch(() => null);

  // Parse begge med Zod (tolerant)
  const a = parseHeader(cmsRaw?.appearance) ?? {};
  const sh = parseHeader((settings as any)?.header) ?? {};

  // HØJDE
  const heightPx =
    pickNum(a.headerHeight, a.height, a.heightPx, sh.headerHeight, sh.height, sh.heightPx) ??
    80;

  // LOGO
  const logoUrl =
    a.logo?.src ?? sh.logo?.src ?? (settings as any)?.logoUrl;
  const logoAlt =
    a.logo?.alt ?? sh.logo?.alt ?? (settings as any)?.logoAlt ?? "Digifly";
  const logoWidthPx =
    pickNum(a.logo?.maxWidth, sh.logo?.maxWidth, (settings as any)?.headerLogoWidth) ?? 150;
  const logoScrolledUrl = a.logo?.scrolledSrc ?? sh.logo?.scrolledSrc;

  // FARVER/LINKS
  const linkColor = a.headerLinkColor ?? a.linkColor ?? sh.headerLinkColor ?? sh.linkColor;
  const linkClass = linkColor === "white" ? "text-white" : "text-black";

  // STICKY/OVERLAY
  const sticky = (a.headerIsSticky ?? a.sticky ?? sh.headerIsSticky ?? sh.sticky ?? true) as boolean;
  const overlay = (a.isOverlay ?? a.overlay ?? sh.isOverlay ?? sh.overlay ?? false) as boolean;

  // BAGGRUND (tillad både bg.initial/scrolled og topBg/scrolledBg)
  const top = a.topBg ?? sh.topBg ?? sh.bg?.initial ?? (a as any).bg?.initial ?? {};
  const sc = a.scrolledBg ?? sh.scrolledBg ?? sh.bg?.scrolled ?? (a as any).bg?.scrolled ?? {};

  const topH = top.h ?? 0;
  const topS = top.s ?? 0;
  const topL = top.l ?? 100;
  const topOpacity = normalizeOpacity(top.opacity ?? 1);

  const scH = sc.h ?? topH;
  const scS = sc.s ?? topS;
  const scL = sc.l ?? topL;
  const scOpacity = normalizeOpacity(sc.opacity ?? topOpacity);

  // BORDER
  const borderEnabled = a.border?.enabled ?? sh.border?.enabled ?? true;
  const borderWidthPx =
    pickNum(a.border?.widthPx, a.border?.width, sh.border?.widthPx, sh.border?.width) ?? 1;

  const borderColor = {
    h: a.border?.color?.h ?? sh.border?.color?.h ?? 0,
    s: a.border?.color?.s ?? sh.border?.color?.s ?? 0,
    l: a.border?.color?.l ?? sh.border?.color?.l ?? 0,
    opacity: a.border?.color?.opacity ?? sh.border?.color?.opacity,
  };
  const borderColorHex = a.border?.colorHex ?? sh.border?.colorHex;

  // NAVLINKS & CTA
  const navLinks =
    (Array.isArray(a.navLinks) && a.navLinks.length > 0) ? a.navLinks :
    (Array.isArray((settings as any)?.headerNavLinks)) ? (settings as any).headerNavLinks : [];

  const cta = a.cta ?? sh.cta ?? undefined;

  return {
    heightPx,
    sticky,
    overlay,
    linkClass,
    logoUrl,
    logoAlt,
    logoWidthPx,
    logoScrolledUrl,
    bg: {
      top: { h: topH, s: topS, l: topL, opacity: topOpacity },
      scrolled: { h: scH, s: scS, l: scL, opacity: scOpacity },
    },
    border: {
      enabled: !!borderEnabled,
      widthPx: borderWidthPx,
      color: borderColor,
      colorHex: borderColorHex,
    },
    navLinks,
    cta,
  };
}
