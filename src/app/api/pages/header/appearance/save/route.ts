import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerDocumentSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";

const DOC_PATH = ["cms", "pages", "header", "header"];
const HEX3 = /^#([0-9a-fA-F]{3})$/;
const HEX6 = /^#([0-9a-fA-F]{6})$/;

function toHsl(c?: any) {
  return {
    h: Number(c?.h ?? 0),
    s: Number(c?.s ?? 0),
    l: Number(c?.l ?? 0),
    opacity: Number(c?.opacity ?? 100),
  };
}

function pickLink(raw: any) {
  const candidate = raw?.headerLinkColor ?? raw?.link?.color ?? raw?.linkColor ?? "";
  const v = String(candidate).trim();
  if (HEX3.test(v) || HEX6.test(v)) {
    return { color: "custom", hex: v };
  }
  return { color: v || "white", hex: "" };
}

function pickBorder(raw: any) {
  const r = raw?.border ?? {};
  const enabled = typeof r.enabled === "boolean" ? r.enabled : !!r.visible;
  const widthPx = r.widthPx ?? r.width ?? 1;
  const color = toHsl(r.color);
  const hex = typeof r.hex === "string" ? r.hex : "";
  return { enabled, widthPx: Number(widthPx), color, hex };
}

function pickBgTop(raw: any) {
  if (raw?.topBg) return toHsl(raw.topBg);
  return {
    h: Number(raw?.headerInitialBackgroundColor?.h ?? 0),
    s: Number(raw?.headerInitialBackgroundColor?.s ?? 0),
    l: Number(raw?.headerInitialBackgroundColor?.l ?? 100),
    opacity: Number(raw?.headerInitialBackgroundOpacity ?? 0),
  };
}

function pickBgScrolled(raw: any) {
  if (raw?.scrolledBg) return toHsl(raw.scrolledBg);
  return {
    h: Number(raw?.headerScrolledBackgroundColor?.h ?? 210),
    s: Number(raw?.headerScrolledBackgroundColor?.s ?? 100),
    l: Number(raw?.headerScrolledBackgroundColor?.l ?? 95),
    opacity: Number(raw?.headerScrolledBackgroundOpacity ?? 98),
  };
}

function normalize(payload: any) {
  const raw = payload?.appearance ? payload.appearance : payload ?? {};
  const link = pickLink(raw);
  const border = pickBorder(raw);
  const topBg = pickBgTop(raw);
  const scrolledBg = pickBgScrolled(raw);
  const headerHeight = Number(raw?.headerHeight ?? raw?.height ?? 80);
  const headerLogoWidth = Number(raw?.headerLogoWidth ?? raw?.logo?.maxWidth ?? 120);
  const isOverlay = !!(raw?.isOverlay ?? payload?.isOverlay ?? true);
  const headerIsSticky = !!(raw?.headerIsSticky ?? raw?.sticky ?? true);
  const navLinks = Array.isArray(raw?.navLinks) ? raw.navLinks : [];
  const logo = {
    url: typeof raw?.logo?.url === "string" ? raw.logo.url : "",
    alt: typeof raw?.logo?.alt === "string" ? raw.logo.alt : "",
    maxWidth: headerLogoWidth,
  };
  const ctaSrc = raw?.cta ?? raw?.headerCtaSettings ?? {};
  const cta = {
    enabled: !!ctaSrc.enabled,
    label: String(ctaSrc.label ?? ""),
    href: String(ctaSrc.href ?? ""),
    linkType: String(ctaSrc.linkType ?? "external"),
    variant: String(ctaSrc.variant ?? "default"),
    size: String(ctaSrc.size ?? "md"),
  };
  const mfSrc = raw?.mobileFloating ?? {};
  const mobileFloating = {
    enabled: !!mfSrc.enabled,
    position: String(mfSrc.position ?? "br"),
    size: String(mfSrc.size ?? "lg"),
    variant: String(mfSrc.variant ?? "pill"),
    height: Number(mfSrc.height ?? 110),
  };
  return {
    appearance: {
      isOverlay,
      headerIsSticky,
      headerHeight,
      headerLogoWidth,
      logo,
      link,
      topBg,
      scrolledBg,
      border,
      cta,
      mobileFloating,
      navLinks,
    },
    updatedBy: String(payload?.updatedBy ?? "cms-user"),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mapped = normalize(body);
    const parsed = headerDocumentSchema.parse({ ...mapped });
    const ref = adminDb.doc(DOC_PATH.join("/"));
    const current = await ref.get();
    const currentVersion = current.exists && typeof current.data()?.version === "number" ? Number(current.data()!.version) : 0;
    const payload = {
      ...parsed,
      version: currentVersion + 1,
      updatedAt: new Date().toISOString(),
    };
    await ref.set(payload, { merge: true });
    return NextResponse.json({ ok: true, data: payload, path: DOC_PATH.join("/") });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 400 });
  }
}
