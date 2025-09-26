
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb.doc("admin/pages/home/home").get();
  if (!snap.exists) return NextResponse.json({}, { status: 404 });
  const data = snap.data()!;
  if (data.updatedAt instanceof Timestamp) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  return NextResponse.json(data);
}
