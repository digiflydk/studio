
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const snap = await adminDb.doc("admin/pages/header/header").get();
  if (!snap.exists) return NextResponse.json({}, { status: 404 });
  const data = snap.data()!;
  return NextResponse.json(data);
}
