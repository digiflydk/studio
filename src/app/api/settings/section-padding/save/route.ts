import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hero = body?.hero;
    if (!hero || typeof hero !== "object") {
      return NextResponse.json({ ok: false, error: "BAD_REQUEST", message: "Missing hero padding" }, { status: 400 });
    }

    // Merge ind i settings/general.sectionPadding.hero
    await adminDb.collection("settings").doc("general").set(
      { sectionPadding: { hero } },
      { merge: true }
    );

    return NextResponse.json({ ok: true });
  } catch (err:any) {
    return NextResponse.json({ ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function OPTIONS() { return NextResponse.json({ ok: true }); }
