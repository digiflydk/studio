import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

export async function GET() {
  try {
    const generalRef = adminDb.doc("settings/general");
    const cmsHeaderRef = adminDb.doc("cms/pages/header/header");

    const snap = await generalRef.get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "settings/general not found" }, { status: 404 });
    }

    const data = snap.data() as any;
    const header = data?.header ?? null;
    if (!header) {
      return NextResponse.json({ ok: false, error: "settings/general.header missing" }, { status: 400 });
    }

    const payload = {
      appearance: header,
      version: data?.header?.version ?? data?.version ?? 1,
      updatedAt: new Date().toISOString(),
    };

    await cmsHeaderRef.set(payload, { merge: true });
    return NextResponse.json({ ok: true, path: "cms/pages/header/header" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
