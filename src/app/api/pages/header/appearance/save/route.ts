import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import HeaderAppearanceSchema from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";

function hexToHsl(hex: string) {
  let h = 0, s = 0, l = 0;
  const rhex = hex.replace("#", "");
  const full = rhex.length === 6 ? rhex : rhex.split("").map(ch => ch + ch).join("");
  const r = parseInt(full.substring(0, 2), 16) / 255;
  const g = parseInt(full.substring(2, 4), 16) / 255;
  const b = parseInt(full.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  l = (max + min) / 2;
  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function normalizeColor(input: any, fallbackOpacity?: number) {
  if (!input) return undefined;
  if (typeof input.hex === "string") {
    const hs = hexToHsl(input.hex);
    const opacity = typeof input.opacity === "number" ? input.opacity : typeof fallbackOpacity === "number" ? fallbackOpacity : 100;
    return { ...hs, opacity, hex: input.hex };
  }
  const h = Number(input.h ?? 0);
  const s = Number(input.s ?? 0);
  const l = Number(input.l ?? 0);
  const opacity = typeof input.opacity === "number" ? input.opacity : typeof fallbackOpacity === "number" ? fallbackOpacity : 100;
  return { h, s, l, opacity };
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = HeaderAppearanceSchema.parse(json);

    const topBg =
      normalizeColor(parsed.topBg, parsed.headerInitialBackgroundOpacity) ||
      normalizeColor(parsed.headerInitialBackgroundColor, parsed.headerInitialBackgroundOpacity);

    const scrolledBg =
      normalizeColor(parsed.scrolledBg, parsed.headerScrolledBackgroundOpacity) ||
      normalizeColor(parsed.headerScrolledBackgroundColor, parsed.headerScrolledBackgroundOpacity);

    const borderColor = parsed.border?.color ? normalizeColor(parsed.border.color, parsed.border?.color?.opacity) : undefined;

    const payload = {
      isOverlay: parsed.isOverlay ?? true,
      headerIsSticky: parsed.headerIsSticky ?? true,
      headerHeight: parsed.headerHeight ?? 80,
      headerLogoWidth: parsed.headerLogoWidth ?? 120,
      headerLinkColor: parsed.headerLinkColor ?? "white",
      topBg: topBg ?? { h: 0, s: 0, l: 100, opacity: 0 },
      scrolledBg: scrolledBg ?? { h: 210, s: 100, l: 95, opacity: 98 },
      border: {
        visible: parsed.border?.visible ?? true,
        widthPx: parsed.border?.widthPx ?? 1,
        color: borderColor ?? { h: 210, s: 16, l: 87, opacity: 100 },
      },
    };

    await adminDb
      .collection("cms")
      .doc("settings")
      .collection("pages")
      .doc("header")
      .set({ appearance: payload }, { merge: true });

    await logAudit({
      action: "cms.header.appearance.save",
      payload,
      status: "success",
    });

    return NextResponse.json({ ok: true, data: payload });
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
