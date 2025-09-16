import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerDocumentSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";

const DOC_PATH = ["cms", "pages", "header", "header"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = headerDocumentSchema.parse(body);
    const ref = adminDb.doc(DOC_PATH.join("/"));
    const current = await ref.get();
    const currentVersion = (current.exists && typeof current.data()?.version === "number") ? current.data()!.version : 0;
    const payload = {
      ...parsed,
      version: (currentVersion ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: parsed.updatedBy || "cms-user",
    };
    await ref.set(payload, { merge: true });
    return NextResponse.json({ ok: true, data: payload });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Invalid payload" }, { status: 400 });
  }
}
