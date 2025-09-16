import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";

// Firestore-doc: cms/pages/header/header
const PATH = { collection: "cms/pages/header", id: "header" };

export async function GET() {
  try {
    const ref = adminDb.collection(PATH.collection).doc(PATH.id);
    const snap = await ref.get();

    if (!snap.exists) {
      // Returnér tom struktur hvis dokumentet ikke findes endnu
      return NextResponse.json({ ok: true, data: {} });
    }

    const data = snap.data() || {};
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
