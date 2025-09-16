import { NextResponse } from "next/server";
import { SavePayloadSchema } from "@/lib/validators/headerAppearance.zod";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";

// Firestore-doc: cms/pages/header/header
const PATH = { collection: "cms/pages/header", id: "header" };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = SavePayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION_ERROR",
          details: parsed.error.flatten(),
          hint: "Send { appearance: {...} } eller et fladt objekt – begge accepteres.",
        },
        { status: 400 }
      );
    }

    const { appearance } = parsed.data;

    // --- ADMIN SDK WRITE (bypasser Security Rules) ---
    const ref = adminDb.collection(PATH.collection).doc(PATH.id);
    const snap = await ref.get();

    const base = {
      appearance,
      updatedAt: new Date(), // brug serverTimestamp hvis du har det wired i admin initialisering
    };

    if (!snap.exists) {
      await ref.set({ ...base, version: 1 }, { merge: false });
    } else {
      const current = snap.data() as any;
      const nextVersion = typeof current?.version === "number" ? current.version + 1 : 1;
      await ref.set({ ...base, version: nextVersion }, { merge: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "UNEXPECTED_ERROR",
        message: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
