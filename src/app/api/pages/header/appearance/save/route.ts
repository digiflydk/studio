import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import HeaderAppearanceSchema from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";

function hexToHsl(hex: string) {
  const rhex = hex.replace("#", "");
  const full = rhex.length === 6 ? rhex : rhex.split("").map(c => c + c).join("");
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function normalizeColor(input: any, fallbackOpacity: number) {
  if (!input) return null;
  if (typeof input.hex === "string") {
    const hs = hexToHsl(input.hex);
    const opacity = typeof input.opacity === "number" ? input.opacity : fallbackOpacity;
    return { ...hs, opacity, hex: input.hex };
  }
  const h = typeof input.h === "number" ? input.h : 0;
  const s = typeof input.s === "number" ? input.s : 0;
  const l = typeof input.l === "number" ? input.l : 100;
  const opacity = typeof input.opacity === "number" ? input.opacity : fallbackOpacity;
  return { h, s, l, opacity };
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const settings = HeaderAppearanceSchema.parse(json);

    const top = normalizeColor(settings.topBg, 0) ?? { h: 0, s: 0, l: 100, opacity: 0 };
    const scrolled = normalizeColor(settings.scrolledBg, 98) ?? { h: 210, s: 100, l: 95, opacity: 98 };
    const borderColor = normalizeColor(settings.border?.color, 100) ?? { h: 210, s: 16, l: 87, opacity: 100 };

    const flat = {
      isOverlay: settings.isOverlay ?? true,
      headerIsSticky: settings.headerIsSticky ?? true,
      headerHeight: settings.headerHeight ?? 80,
      headerLogoWidth: settings.headerLogoWidth ?? 120,
      headerLinkColor: settings.headerLinkColor ?? "white",
      headerInitialBackgroundColor: { h: top.h, s: top.s, l: top.l },
      headerInitialBackgroundOpacity: top.opacity,
      headerScrolledBackgroundColor: { h: scrolled.h, s: scrolled.s, l: scrolled.l },
      headerScrolledBackgroundOpacity: scrolled.opacity,
      headerTopBorderEnabled: settings.border?.enabled ?? true,
      headerTopBorderHeight: settings.border?.width ?? 1,
      headerTopBorderColor: { h: borderColor.h, s: borderColor.s, l: borderColor.l },
      headerNavLinks: settings.navLinks ?? [],
    };

    const nested = {
      header: {
        bg: {
          initial: { h: top.h, s: top.s, l: top.l, opacity: top.opacity },
          scrolled: { h: scrolled.h, s: scrolled.s, l: scrolled.l, opacity: scrolled.opacity },
        },
        border: {
          enabled: flat.headerTopBorderEnabled,
          width: flat.headerTopBorderHeight,
          color: { h: borderColor.h, s: borderColor.s, l: borderColor.l, opacity: borderColor.opacity },
        },
        logo: { maxWidth: flat.headerLogoWidth },
        height: flat.headerHeight,
      },
      navLinks: flat.headerNavLinks,
    };

    await adminDb.collection("cms").doc("settings").set({ ...flat, ...nested }, { merge: true });

    await logAudit({
      action: "cms.header.appearance.save",
      payload: { ...flat, ...nested },
      status: "success",
    });

    return NextResponse.json({ ok: true, data: { ...flat, ...nested } });
  } catch (err: any) {
    await logAudit({
      action: "cms.header.appearance.save",
      payload: null,
      status: "error",
      meta: { message: err?.message },
    });
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 400 });
  }
}
