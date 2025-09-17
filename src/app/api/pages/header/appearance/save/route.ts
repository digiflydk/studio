
// src/app/api/pages/header/appearance/save/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { HeaderAppearanceSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REF = () => adminDb.collection("cms").doc("pages").collection("header").doc("header");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = HeaderAppearanceSchema.parse(body); // kaster ved fejl

    await REF().set(parsed, { merge: true });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    const message = e?.issues ? "VALIDATION_ERROR" : (e?.message ?? "Unknown");
    return NextResponse.json(
      { ok: false, error: e?.issues ? "VALIDATION_ERROR" : "UNEXPECTED_ERROR", message, issues: e?.issues },
      { status: 400 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
