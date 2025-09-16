import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { SettingsGeneralSchema } from "@/lib/validators/settingsGeneral.zod";

export const runtime = "nodejs";

const PATH = { collection: "settings", id: "general" };

export async function GET() {
  try {
    const ref = adminDb.collection(PATH.collection).doc(PATH.id);
    const snap = await ref.get();

    const exists = snap.exists;
    const raw = exists ? (snap.data() || {}) : {};
    const parsed = SettingsGeneralSchema.safeParse(raw);

    return NextResponse.json({
      ok: true,
      exists,
      path: `${PATH.collection}/${PATH.id}`,
      raw,
      normalized: parsed.success ? parsed.data : null,
      validation: parsed.success ? "ok" : parsed.error.flatten(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
