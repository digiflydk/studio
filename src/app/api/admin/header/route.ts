
import { NextResponse } from "next/server";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getFirestore(initAdmin());
  const snap = await db.doc("admin/pages/header/header").get();
  if (!snap.exists) return NextResponse.json({}, { status: 404 });
  const data = snap.data()!;
  return NextResponse.json(data);
}
