import { NextResponse } from "next/server";
import { initAdmin } from "@/lib/server/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const app = initAdmin();
    const adminProjectId = app.options.projectId || null;

    const db = getFirestore(app);
    const headerSnap = await db.doc("admin/pages/header/header").get();
    const homeSnap = await db.doc("admin/pages/home/home").get();

    return NextResponse.json({
      ok: true,
      info: {
        adminProjectId,
        headerExists: headerSnap.exists,
        homeExists: homeSnap.exists,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      info: {
        adminProjectId: null,
        error: e?.message || String(e),
      },
    }, { status: 500 });
  }
}
