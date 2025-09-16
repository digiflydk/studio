import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerDocumentSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";

const DOC_PATH = ["cms", "pages", "header", "header"];

export async function GET() {
  const ref = adminDb.doc(DOC_PATH.join("/"));
  const snap = await ref.get();
  if (!snap.exists) {
    const seed = headerDocumentSchema.parse({ appearance: {} });
    await ref.set({ ...seed, updatedAt: new Date().toISOString(), updatedBy: "system" }, { merge: true });
    return NextResponse.json({ ok: true, data: seed, created: true });
  }
  return NextResponse.json({ ok: true, data: snap.data() || null });
}
