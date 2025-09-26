
import { NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  initAdmin();
  const db = getFirestore();
  const snap = await db.doc("admin/pages/home/home").get();
  if (!snap.exists) return NextResponse.json({}, { status: 404 });
  const data: any = snap.data() || {};
  if (data.updatedAt instanceof Timestamp) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  return NextResponse.json(data);
}
