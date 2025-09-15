import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import HeaderAppearanceSchema from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";

type HeaderAppearanceInput = ReturnType<typeof HeaderAppearanceSchema["parse"]>;

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data: HeaderAppearanceInput = HeaderAppearanceSchema.parse(json);

    await adminDb
      .collection("cms")
      .doc("settings")
      .collection("pages")
      .doc("header")
      .set({ appearance: data }, { merge: true });

    await logAudit({
      action: "cms.header.appearance.save",
      payload: data,
      status: "success",
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    await logAudit({
      action: "cms.header.appearance.save",
      payload: null,
      status: "error",
      meta: { message: err?.message },
    });

    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
