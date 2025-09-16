import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { getGeneralSettings } from "@/services/settings";

export const runtime = "nodejs";

// Firestore-doc: cms/pages/header/header
const PATH = { collection: "cms/pages/header", id: "header" };

export async function GET() {
  try {
    const [headerSnap, generalSettings] = await Promise.all([
        adminDb.collection(PATH.collection).doc(PATH.id).get(),
        getGeneralSettings(),
    ]);

    const headerData = headerSnap.exists ? headerSnap.data() || {} : {};
    const g = generalSettings || {};

    const gHeader = (g as any).header ?? {}; // hvis I bruger nested header
    const logoUrl = g.logoUrl;
    const logoScrolledUrl = (g as any).logoScrolledUrl; // NYT

    const appearance = {
      ...(headerData.appearance ?? headerData ?? {}),

      logo: {
        ...(headerData?.appearance?.logo ?? headerData?.logo ?? {}),
        src: headerData?.appearance?.logo?.src ?? headerData?.logo?.src ?? logoUrl ?? undefined,
        scrolledSrc: headerData?.appearance?.logo?.scrolledSrc ?? headerData?.logo?.scrolledSrc ?? logoScrolledUrl ?? undefined, // NYT fallback
        alt: headerData?.appearance?.logo?.alt ?? headerData?.logo?.alt ?? g.logoAlt ?? "Logo",
        maxWidth: headerData?.appearance?.headerLogoWidth ?? headerData?.logo?.maxWidth ?? (gHeader?.logo?.maxWidth ?? g.headerLogoWidth ?? 140),
      },

      // Normal bg
      topBg: {
        ...(headerData?.appearance?.topBg ?? {}),
        hex: headerData?.appearance?.topBg?.hex ?? (g as any).headerInitialBackgroundHex ?? undefined, // NYT
        h: headerData?.appearance?.topBg?.h ?? gHeader?.bg?.initial?.h ?? (g as any).headerInitialBackgroundColor?.h ?? 0,
        s: headerData?.appearance?.topBg?.s ?? gHeader?.bg?.initial?.s ?? (g as any).headerInitialBackgroundColor?.s ?? 0,
        l: headerData?.appearance?.topBg?.l ?? gHeader?.bg?.initial?.l ?? (g as any).headerInitialBackgroundColor?.l ?? 100,
        opacity: headerData?.appearance?.topBg?.opacity ??
                 (g as any).headerInitialBackgroundOpacity ??
                 gHeader?.bg?.initial?.opacity ??
                 100,
      },

      // Scrolled bg
      scrolledBg: {
        ...(headerData?.appearance?.scrolledBg ?? {}),
        hex: headerData?.appearance?.scrolledBg?.hex ?? (g as any).headerScrolledBackgroundHex ?? undefined, // NYT
        h: headerData?.appearance?.scrolledBg?.h ?? gHeader?.bg?.scrolled?.h ?? (g as any).headerScrolledBackgroundColor?.h ?? 210,
        s: headerData?.appearance?.scrolledBg?.s ?? gHeader?.bg?.scrolled?.s ?? (g as any).headerScrolledBackgroundColor?.s ?? 100,
        l: headerData?.appearance?.scrolledBg?.l ?? gHeader?.bg?.scrolled?.l ?? (g as any).headerScrolledBackgroundColor?.l ?? 95,
        opacity: headerData?.appearance?.scrolledBg?.opacity ??
                 (g as any).headerScrolledBackgroundOpacity ??
                 gHeader?.bg?.scrolled?.opacity ??
                 98,
      },

      // Border
      border: {
        ...(headerData?.appearance?.border ?? {}),
        enabled: headerData?.appearance?.border?.enabled ?? (g as any).headerTopBorderEnabled ?? gHeader?.border?.enabled ?? false,
        widthPx: headerData?.appearance?.border?.widthPx ?? (g as any).headerTopBorderHeight ?? gHeader?.border?.width ?? 1,
        colorHex: headerData?.appearance?.border?.colorHex ?? (g as any).headerBorderColorHex ?? undefined, // NYT
        color: headerData?.appearance?.border?.color ??
               (g as any).headerTopBorderColor ??
               gHeader?.border?.color ??
               { h: 220, s: 13, l: 91 },
      },

      headerIsSticky: headerData?.appearance?.headerIsSticky ?? g.headerIsSticky ?? true,
      headerHeight: headerData?.appearance?.headerHeight ?? g.headerHeight ?? 72,
      headerLogoWidth: headerData?.appearance?.headerLogoWidth ?? g.headerLogoWidth ?? 140,
      headerLinkColor: headerData?.appearance?.headerLinkColor ?? g.headerLinkColor ?? "white",
      headerLinkColorHex: headerData?.appearance?.headerLinkColorHex ?? (g as any).headerLinkColorHex ?? undefined,
      navLinks: Array.isArray(headerData?.appearance?.navLinks)
        ? headerData.appearance.navLinks
        : (g.headerNavLinks ?? []),
    };

    return NextResponse.json({ ok: true, data: { appearance } });

  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
