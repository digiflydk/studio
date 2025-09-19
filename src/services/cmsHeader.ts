"use server";
import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/server/firebaseAdmin";
import type { HeaderAppearance } from "@/lib/validators/headerAppearance.zod";

const DOC_PATH = ["cms", "pages", "header", "header"];

export async function getCmsHeader(): Promise<HeaderAppearance | null> {
  noStore();
  const snap = await adminDb.doc(DOC_PATH.join("/")).get();
  return snap.exists ? (snap.data() as HeaderAppearance) : null;
}
