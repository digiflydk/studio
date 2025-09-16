
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

function toPctOpacity(v: any, def: number) {
  const n = Number(v ?? def);
  if (n > 0 && n <= 1) return Math.round(n * 100); // 0–1 → %
  if (Number.isNaN(n)) return def;
  return n;
}

export async function GET() {
  try {
    const headerRef = adminDb.collection("cms/pages/header").doc("header");
    const generalRef = adminDb.collection("settings").doc("general");
    const [headerSnap, generalSnap] = await Promise.all([headerRef.get(), generalRef.get()]);

    const headerData = headerSnap.exists ? (headerSnap.data() || {}) : {};
    const g = generalSnap.exists ? (generalSnap.data() || {}) : {};
    const gHeader = (g as any).header ?? {};

    const appearance = {
      ...(headerData.appearance ?? headerData ?? {}),

      logo: {
        ...(headerData?.appearance?.logo ?? headerData?.logo ?? {}),
        src: headerData?.appearance?.logo?.src ?? headerData?.logo?.src ?? g.logoUrl ?? undefined,
        scrolledSrc: headerData?.appearance?.logo?.scrolledSrc ?? headerData?.logo?.scrolledSrc ?? g.logoScrolledUrl ?? undefined,
        alt: headerData?.appearance?.logo?.alt ?? headerData?.logo?.alt ?? g.logoAlt ?? "Logo",
        maxWidth: headerData?.appearance?.headerLogoWidth ?? headerData?.logo?.maxWidth ?? g.headerLogoWidth ?? 140,
      },

      topBg: {
        ...(headerData?.appearance?.topBg ?? {}),
        hex: headerData?.appearance?.topBg?.hex ?? g.headerInitialBackgroundHex ?? undefined,
        h: headerData?.appearance?.topBg?.h ?? gHeader?.bg?.initial?.h ?? g.headerInitialBackgroundColor?.h ?? 0,
        s: headerData?.appearance?.topBg?.s ?? gHeader?.bg?.initial?.s ?? g.headerInitialBackgroundColor?.s ?? 0,
        l: headerData?.appearance?.topBg?.l ?? gHeader?.bg?.initial?.l ?? g.headerInitialBackgroundColor?.l ?? 100,
        opacity: toPctOpacity(
          headerData?.appearance?.topBg?.opacity ??
          g.headerInitialBackgroundOpacity ??
          gHeader?.bg?.initial?.opacity, 
          100
        ),
      },

      scrolledBg: {
        ...(headerData?.appearance?.scrolledBg ?? {}),
        hex: headerData?.appearance?.scrolledBg?.hex ?? g.headerScrolledBackgroundHex ?? undefined,
        h: headerData?.appearance?.scrolledBg?.h ?? gHeader?.bg?.scrolled?.h ?? g.headerScrolledBackgroundColor?.h ?? 210,
        s: headerData?.appearance?.scrolledBg?.s ?? gHeader?.bg?.scrolled?.s ?? g.headerScrolledBackgroundColor?.s ?? 100,
        l: headerData?.appearance?.scrolledBg?.l ?? gHeader?.bg?.scrolled?.l ?? g.headerScrolledBackgroundColor?.l ?? 95,
        opacity: toPctOpacity(
          headerData?.appearance?.scrolledBg?.opacity ??
          g.headerScrolledBackgroundOpacity ??
          gHeader?.bg?.scrolled?.opacity,
          98
        ),
      },

      border: {
        ...(headerData?.appearance?.border ?? {}),
        enabled: headerData?.appearance?.border?.enabled ?? g.headerTopBorderEnabled ?? gHeader?.border?.enabled ?? false,
        widthPx: headerData?.appearance?.border?.widthPx ?? g.headerTopBorderHeight ?? gHeader?.border?.width ?? 1,
        colorHex: headerData?.appearance?.border?.colorHex ?? g.headerBorderColorHex ?? undefined,
        color: headerData?.appearance?.border?.color ?? g.headerTopBorderColor ?? gHeader?.border?.color ?? { h: 220, s: 13, l: 91 },
      },

      headerIsSticky: headerData?.appearance?.headerIsSticky ?? g.headerIsSticky ?? true,
      headerHeight: headerData?.appearance?.headerHeight ?? g.headerHeight ?? 72,
      headerLogoWidth: headerData?.appearance?.headerLogoWidth ?? g.headerLogoWidth ?? 140,
      headerLinkColor: headerData?.appearance?.headerLinkColor ?? g.headerLinkColor ?? "white",
      headerLinkColorHex: headerData?.appearance?.headerLinkColorHex ?? g.headerLinkColorHex ?? undefined,
      navLinks: Array.isArray(headerData?.appearance?.navLinks) ? headerData.appearance.navLinks : (g.headerNavLinks ?? []),
    };

    // Sikkerhed: hvis opacity ender som 0 men der er farve, hæv til solid default
    if ((appearance.topBg?.opacity ?? 0) === 0 && (appearance.topBg?.hex || Number.isFinite(appearance.topBg?.h))) {
      appearance.topBg.opacity = 100;
    }
    if ((appearance.scrolledBg?.opacity ?? 0) === 0 && (appearance.scrolledBg?.hex || Number.isFinite(appearance.scrolledBg?.h))) {
      appearance.scrolledBg.opacity = 100;
    }

    return NextResponse.json({ ok: true, data: { appearance } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}


export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
