import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import HeaderAppearanceSchema from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";

function hexToHsl(hex: string) {
  const s = hex.replace("#", "");
  const full = s.length === 6 ? s : s.split("").map(c => c + c).join("");
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, ss = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    ss = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4; break; }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(ss * 100), l: Math.round(l * 100) };
}

function to0_100(op?: number) {
  if (typeof op !== "number") return undefined;
  if (op <= 1) return Math.round(op * 100);
  return Math.round(op);
}

function normalizeColor(input: any, fallbackOpacity: number) {
  if (!input) return null;
  if (typeof input.hex === "string") {
    const hs = hexToHsl(input.hex);
    const opacity = to0_100(input.opacity);
    return { ...hs, opacity: typeof opacity === "number" ? opacity : fallbackOpacity };
  }
  const h = typeof input.h === "number" ? input.h : 0;
  const s = typeof input.s === "number" ? input.s : 0;
  const l = typeof input.l === "number" ? input.l : 100;
  const opacity = to0_100(input.opacity ?? input.a);
  return { h, s, l, opacity: typeof opacity === "number" ? opacity : fallbackOpacity };
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const dto = HeaderAppearanceSchema.parse(json);

    const top = normalizeColor(dto.topBg, 0) ?? { h: 0, s: 0, l: 100, opacity: 0 };
    const scr = normalizeColor(dto.scrolledBg, 98) ?? { h: 210, s: 100, l: 95, opacity: 98 };

    const borderColor = normalizeColor(dto.border?.color, 100) ?? { h: 210, s: 16, l: 87, opacity: 100 };
    const border = {
      visible: dto.border?.visible ?? true,
      widthPx: dto.border?.widthPx ?? 1,
      color: { h: borderColor.h, s: borderColor.s, l: borderColor.l, opacity: borderColor.opacity },
    };

    const appearance = {
      isOverlay: dto.isOverlay ?? true,
      headerIsSticky: dto.headerIsSticky ?? true,
      headerHeight: dto.headerHeight ?? 80,
      headerLogoWidth: dto.headerLogoWidth ?? 120,
      headerLinkColor: dto.headerLinkColor ?? "white",
      topBg: top,
      scrolledBg: scr,
      border,
      navLinks: dto.navLinks ?? [],
    };

    // ÉN sandhed: skriv KUN til cms/pages/header
    await adminDb.collection("cms").doc("pages").collection("header").doc("header").set(
      { appearance },
      { merge: true }
    );

    await logAudit({ action: "cms.header.appearance.save", payload: appearance, status: "success" } as any);

    return NextResponse.json({ ok: true, data: appearance });
  } catch (err: any) {
    await logAudit({
      action: "cms.header.appearance.save",
      payload: null,
      status: "error",
      meta: { message: err?.message },
    } as any);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 400 });
  }
}
