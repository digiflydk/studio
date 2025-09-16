import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { SettingsGeneralSchema } from "@/lib/validators/settingsGeneral.zod";

export const runtime = "nodejs";

// Antaget struktur: collection "settings", doc "general"
const PATH = { collection: "settings", id: "general" };

export async function GET() {
  try {
    const ref = adminDb.collection(PATH.collection).doc(PATH.id);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json({ ok: true, data: {}, normalized: {} });
    }

    const raw = snap.data() || {};
    const parsed = SettingsGeneralSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_WARNING", details: parsed.error.flatten(), data: raw },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, data: raw, normalized: parsed.data });
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
