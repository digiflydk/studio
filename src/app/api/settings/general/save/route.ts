
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { SettingsGeneralSchema } from "@/lib/validators/settingsGeneral.zod";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fetch the current document
    const currentSnap = await adminDb.doc("settings/general").get();
    const current = (currentSnap.exists ? currentSnap.data() : {}) as Record<string, unknown>;

    // Merge current data with the new body to ensure a complete object for parsing
    const merged = { ...current, ...body };
    const parsed = SettingsGeneralSchema.parse(merged);

    await adminDb.collection("settings").doc("general").set(parsed, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error", issues: err.issues },
      { status: 500 }
    );
  }
}
