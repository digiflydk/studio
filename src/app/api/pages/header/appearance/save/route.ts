import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerAppearanceSchema } from "@/lib/validators/headerAppearance.zod";
import { normalizeLinkColor } from "@/lib/colors";
import { CMS_DOC_PAGES } from "@/lib/server/firestorePaths";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = headerAppearanceSchema.parse(json);

    const normalizedLink = normalizeLinkColor(parsed.headerLinkColor);
    const data = {
      appearance: {
        isOverlay: parsed.isOverlay,
        headerIsSticky: parsed.headerIsSticky,
        headerHeight: parsed.headerHeight,
        headerLogoWidth: parsed.headerLogoWidth,
        headerLinkColor: normalizedLink.raw, // gem menneskelig værdi (fx "white" eller "#111111")
        topBg: parsed.topBg,
        scrolledBg: parsed.scrolledBg,
        border: parsed.border ?? undefined,
        navLinks: parsed.navLinks ?? [],
      },
    };

    await adminDb.collection(CMS_DOC_PAGES.collection).doc(CMS_DOC_PAGES.doc).set({ header: data }, { merge: true });

    return NextResponse.json({ ok: true, saved: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 400 });
  }
}
