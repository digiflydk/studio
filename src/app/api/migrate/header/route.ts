export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

function op(v?: number) {
  if (typeof v !== "number") return undefined;
  if (v <= 1) return Math.round(v * 100);
  return Math.round(v);
}

export async function POST() {
  // Læs kilder: (a) cms/settings + nested, (b) cms/settings/pages/header
  const settingsDoc = await adminDb.collection("cms").doc("settings").get();
  const headerSettingsDoc = await adminDb.collection("cms").doc("settings").collection("pages").doc("header").get();

  const s = settingsDoc.exists ? settingsDoc.data() as any : {};
  const p = headerSettingsDoc.exists ? headerSettingsDoc.data() as any : {};

  const topSrc = p?.appearance?.topBg ?? s?.header?.bg?.initial ?? (s?.headerInitialBackgroundColor ? { ...s.headerInitialBackgroundColor, opacity: s?.headerInitialBackgroundOpacity } : null);
  const scrSrc = p?.appearance?.scrolledBg ?? s?.header?.bg?.scrolled ?? (s?.headerScrolledBackgroundColor ? { ...s.headerScrolledBackgroundColor, opacity: s?.headerScrolledBackgroundOpacity } : null);

  const top = topSrc ? { h: topSrc.h ?? 0, s: topSrc.s ?? 0, l: topSrc.l ?? 100, opacity: op(topSrc.opacity ?? topSrc.a) ?? 0 } : { h: 0, s: 0, l: 100, opacity: 0 };
  const scr = scrSrc ? { h: scrSrc.h ?? 210, s: scrSrc.s ?? 100, l: scrSrc.l ?? 95, opacity: op(scrSrc.opacity ?? scrSrc.a) ?? 98 } : { h: 210, s: 100, l: 95, opacity: 98 };

  const appearance = {
    isOverlay: (p?.appearance?.isOverlay ?? s?.isOverlay) ?? true,
    headerIsSticky: (p?.appearance?.headerIsSticky ?? s?.headerIsSticky) ?? true,
    headerHeight: (p?.appearance?.headerHeight ?? s?.header?.height ?? s?.headerHeight) ?? 80,
    headerLogoWidth: (p?.appearance?.headerLogoWidth ?? s?.header?.logo?.maxWidth ?? s?.headerLogoWidth) ?? 120,
    headerLinkColor: (p?.appearance?.headerLinkColor ?? s?.headerLinkColor) ?? "white",
    topBg: top,
    scrolledBg: scr,
    border: {
      visible: (p?.appearance?.border?.visible ?? s?.headerTopBorderEnabled ?? s?.header?.border?.enabled) ?? true,
      widthPx: (p?.appearance?.border?.widthPx ?? s?.headerTopBorderHeight ?? s?.header?.border?.width) ?? 1,
      color: {
        h: (p?.appearance?.border?.color?.h ?? s?.headerTopBorderColor?.h ?? s?.header?.border?.color?.h) ?? 210,
        s: (p?.appearance?.border?.color?.s ?? s?.headerTopBorderColor?.s ?? s?.header?.border?.color?.s) ?? 16,
        l: (p?.appearance?.border?.color?.l ?? s?.headerTopBorderColor?.l ?? s?.header?.border?.color?.l) ?? 87,
        opacity: (p?.appearance?.border?.color?.opacity ?? op(s?.header?.border?.color?.opacity)) ?? 100,
      },
    },
    navLinks: (p?.appearance?.navLinks ?? s?.headerNavLinks ?? s?.header?.navLinks) ?? [],
  };

  // Skriv til endelig sandhed: cms/pages/header
  await adminDb.collection("cms").doc("pages").collection("header").doc("header").set({ appearance }, { merge: true });

  return NextResponse.json({ ok: true, data: appearance });
}
