import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerDocumentSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";

const DOC_PATH = ["cms", "pages", "header", "header"];

export async function GET() {
  const ref = adminDb.doc(DOC_PATH.join("/"));
  const snap = await ref.get();
  if (!snap.exists) {
    const seed = headerDocumentSchema.parse({ appearance: {} });
    const payload = { ...seed, updatedAt: new Date().toISOString(), updatedBy: "system" };
    await ref.set(payload, { merge: true });
  }
  const data = (await ref.get()).data() as any;
  const a = data?.appearance ?? {};
  const legacy = {
    appearance: {
      border: { visible: !!a?.border?.enabled, color: a?.border?.color, widthPx: a?.border?.widthPx },
      isOverlay: !!a?.isOverlay,
      headerLogoWidth: a?.headerLogoWidth ?? a?.logo?.maxWidth,
      scrolledBg: a?.scrolledBg,
      headerHeight: a?.headerHeight,
      headerIsSticky: !!a?.headerIsSticky,
      topBg: a?.topBg,
      headerLinkColor: a?.link?.hex ? a?.link?.hex : a?.link?.color,
      navLinks: Array.isArray(a?.navLinks) ? a.navLinks : [],
    },
  };
  return NextResponse.json({ ok: true, data: legacy });
}
