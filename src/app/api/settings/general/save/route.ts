
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { SettingsGeneralSchema } from "@/lib/validators/settingsGeneral.zod";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Valider hele dokumentet el. partial merge – vi tillader partial payload:
    const parsed = SettingsGeneralSchema.partial().parse(body);

    await adminDb.collection("settings").doc("general").set(parsed, { merge: true });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
