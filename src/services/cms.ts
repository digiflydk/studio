"use server";
import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { CMS_DOC_PAGES } from "@/lib/server/firestorePaths";
import type { HeaderAppearance } from "@/lib/validators/headerAppearance.zod";


export type CmsHeaderDoc = {
  appearance?: HeaderAppearance;
};

export async function getCmsHeaderPage(): Promise<HeaderAppearance | null> {
  noStore();
  const snap = await adminDb.collection(CMS_DOC_PAGES.collection).doc(CMS_DOC_PAGES.doc).get();
  const data = snap.exists ? (snap.data() as CmsHeaderDoc) : undefined;
  return data?.appearance ?? null;
}
