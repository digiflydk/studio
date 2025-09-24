import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { getGeneralSettings } from "@/services/settings";

type AnyObj = Record<string, any>;

export async function POST() {
  const data = await getGeneralSettings();
  const src: AnyObj = (data as any)?.header ?? {};

  const payload: AnyObj = {
    headerHeight: src.headerHeight ?? data?.headerHeight ?? 80,
    headerIsSticky: src.headerIsSticky ?? data?.headerIsSticky ?? true,
    headerLinkColor: src.headerLinkColor ?? data?.headerLinkColor ?? "black",
    isOverlay: src.isOverlay ?? false,
    border: {
      enabled: src.border?.enabled ?? true,
      widthPx: src.border?.widthPx ?? 1,
      color: {
        h: src.border?.color?.h ?? 0,
        s: src.border?.color?.s ?? 0,
        l: src.border?.color?.l ?? 0,
        opacity: src.border?.color?.opacity ?? 100,
      },
      colorHex: src.border?.colorHex ?? "#000000",
    },
    headerLogoWidth: src.logo?.maxWidth ?? data?.headerLogoWidth ?? 150,
    logo: {
      src: src.logo?.src ?? data?.logoUrl ?? "",
      scrolledSrc: src.logo?.scrolledSrc ?? src.logo?.src ?? data?.logoUrl ?? "",
      alt: src.logo?.alt ?? data?.logoAlt ?? "Digifly",
      maxWidth: src.logo?.maxWidth ?? data?.headerLogoWidth ?? 150,
    },
    navLinks: Array.isArray(src.navLinks) ? src.navLinks : data?.headerNavLinks || [],
  };

  await adminDb.doc("cms/pages/header/header").set(
    {
      appearance: payload,
      version: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: "studio",
    },
    { merge: true }
  );

  return NextResponse.json({ ok: true, saved: true, payload });
}
