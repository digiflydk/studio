import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const out: any = { ok: true, info: {} };
  try {
    const app = initAdmin();
    out.info.adminProjectId = app.options?.projectId ?? null;

    const db = getFirestore(app);

    // Check header doc
    try {
      const h = await db.doc("admin/pages/header/header").get();
      out.info.headerExists = h.exists;
    } catch (e: any) {
      out.ok = false;
      out.info.headerError = `${e?.code ?? ""} ${e?.message ?? e}`;
    }

    // Check home doc
    try {
      const hm = await db.doc("admin/pages/home/home").get();
      out.info.homeExists = hm.exists;
    } catch (e: any) {
      out.ok = false;
      out.info.homeError = `${e?.code ?? ""} ${e?.message ?? e}`;
    }
  } catch (e: any) {
    out.ok = false;
    out.error = `${e?.code ?? ""} ${e?.message ?? e}`;
  }

  return NextResponse.json(out, { status: 200 });
}
