
// src/app/api/pages/header/appearance/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
// Hvis I har en zod, brug dens NAVN præcis som den er eksporteret:
import { HeaderAppearanceSchema } from "@/lib/validators/headerAppearance.zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REF = () => adminDb.collection("cms").doc("pages").collection("header").doc("header");

function normalizeLegacyToNew(input: any) {
  // Map evt. gamle felter til ny struktur (tilpas efter jeres schema)
  // Vi holder den konservativ her – hvis intet legacy, returner input som er.
  return input ?? {};
}

export async function GET() {
  try {
    const snap = await REF().get();
    const raw = snap.exists ? snap.data() : {};
    const normalized = normalizeLegacyToNew(raw);

    // Valider mod skema – hvis ugyldigt, returnér som ok:false (hjælper CMS med at vise fejl)
    const parse = HeaderAppearanceSchema.safeParse(normalized);
    if (!parse.success) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", issues: parse.error.issues, data: normalized },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, data: parse.data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: e?.message ?? "Unknown" },
      { status: 500 }
    );
  }
}
