
import { NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = getFirestore(initAdmin());
    const snap = await db.doc("admin/pages/home/home").get();
    if (!snap.exists) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    const data = snap.data()!;
    if (data.updatedAt instanceof Timestamp) data.updatedAt = data.updatedAt.toDate().toISOString();
    return NextResponse.json(data);
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "admin_fetch_error";
    const hint =
      "Tjek FIREBASE_SERVICE_ACCOUNT_JSON eller Application Default Credentials. " +
      "Se DF-212 for opsætning.";
    return NextResponse.json({ ok: false, error: msg, hint }, { status: 503 });
  }
}
