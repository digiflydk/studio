import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerDocumentSchema } from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";

const DOC_PATH = ["cms", "pages", "header", "header"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = headerDocumentSchema.parse(body);
    const ref = adminDb.doc(DOC_PATH.join("/"));
    const payload = {
      ...parsed,
      version: (parsed.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: parsed.updatedBy || "cms-user",
    };
    await ref.set(payload, { merge: true });
    await logAudit("cms.header.save", { path: DOC_PATH.join("/"), payload });
    return NextResponse.json({ ok: true, data: payload });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Invalid payload" }, { status: 400 });
  }
}
