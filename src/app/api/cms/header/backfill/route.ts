
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import type { GeneralSettings, HeaderSettings } from "@/types/settings";

export async function POST() {
  try {
    const settingsDoc = await adminDb.doc("settings/general").get();
    if (!settingsDoc.exists) {
      return NextResponse.json({ ok: false, error: "settings/general not found" }, { status: 404 });
    }

    const data = settingsDoc.data() as GeneralSettings || {};
    const src = data.header || {};

    const appearance: Partial<HeaderSettings> = {
      headerHeight: src.headerHeight ?? 80,
      headerIsSticky: src.headerIsSticky ?? true,
      headerLinkColor: src.headerLinkColor ?? "black",
      topBg: (src as any).topBg ?? { h: 0, s: 0, l: 100, opacity: 1 },
      scrolledBg: (src as any).scrolledBg ?? { h: 0, s: 0, l: 100, opacity: 1 },
      isOverlay: src.isOverlay ?? false,
      border: {
        enabled: src.border?.enabled ?? true,
        widthPx: src.border?.widthPx ?? 1,
        color: {
          h: src.border?.color?.h ?? 0,
          s: src.border?.color?.s ?? 0,
          l: src.border?.color?.l ?? 0,
          opacity: src.border?.color?.opacity ?? 100
        },
        colorHex: src.border?.colorHex ?? "#000000"
      },
      headerLogoWidth: src.logo?.maxWidth ?? 150,
      logo: {
        src: src.logo?.src ?? data.logoUrl ?? "",
        alt: src.logo?.alt ?? data.logoAlt ?? "Digifly",
        maxWidth: src.logo?.maxWidth ?? 150
      },
      navLinks: Array.isArray(src.navLinks) ? src.navLinks : (data.headerNavLinks || [])
    };

    const cmsRef = adminDb.doc("cms/pages/header/header");
    await cmsRef.set(
      {
        appearance,
        version: (data as any).version ?? 1,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    const saved = await cmsRef.get();
    return NextResponse.json({ ok: true, path: cmsRef.path, doc: saved.data() });
  } catch (e: any) {
    console.error("Backfill failed:", e);
    return NextResponse.json({ ok: false, error: e?.message || "unknown" }, { status: 500 });
  }
}
