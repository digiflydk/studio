import { NextResponse } from "next/server";
import { SavePayloadSchema } from "@/lib/validators/headerAppearance.zod";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";

// Firestore-doc: cms/pages/header/header
const PATH = { collection: "cms/pages/header", id: "header" };

function stripUndefinedDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((v) => stripUndefinedDeep(v)) as unknown as T;
  }
  if (input && typeof input === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(input as any)) {
      if (typeof v === "undefined") continue; // drop undefined
      const cleaned = stripUndefinedDeep(v as any);
      // drop tomme objekter der kun opstår pga. undefined
      if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0) {
        // behold tomme objekter hvis de giver mening? Vi skipper dem for at være sikre
        continue;
      }
      out[k] = cleaned;
    }
    return out;
  }
  return input;
}


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

    // Rens for undefined, så Firestore accepterer dokumentet
    const cleanedAppearance = stripUndefinedDeep(appearance);

    // --- ADMIN SDK WRITE (bypasser Security Rules) ---
    const ref = adminDb.collection(PATH.collection).doc(PATH.id);
    const snap = await ref.get();

    const base = {
      appearance: cleanedAppearance,
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
