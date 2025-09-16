import { NextResponse } from "next/server";
import { SavePayloadSchema } from "@/lib/validators/headerAppearance.zod";
import { db } from "@/lib/client/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const TARGET = { col: "cms/pages/header", id: "header" };

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
          example: {
            appearance: {
              isOverlay: true,
              headerIsSticky: true,
              headerHeight: 80,
              headerLogoWidth: 120,
              headerLinkColor: "white",
              border: { enabled: true, widthPx: 1, color: { h: 210, s: 16, l: 87 } },
              topBg: { h: 0, s: 0, l: 100, opacity: 0 },
              scrolledBg: { h: 210, s: 100, l: 95, opacity: 98 },
              navLinks: [],
            },
          },
        },
        { status: 400 }
      );
    }

    const { appearance } = parsed.data;

    const ref = doc(db, TARGET.col, TARGET.id);
    const snap = await getDoc(ref);

    const base = {
      appearance,
      updatedAt: serverTimestamp(),
    };

    if (!snap.exists()) {
      await setDoc(ref, { ...base, version: 1 });
    } else {
      const current = snap.data() as any;
      const nextVersion = typeof current?.version === "number" ? current.version + 1 : 1;
      await updateDoc(ref, { ...base, version: nextVersion });
    }

    return NextResponse.json({ ok: true });
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