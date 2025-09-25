
import { adminDb } from "@/lib/server/firebaseAdmin";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";

const DOC_PATH = "cms/pages/header/header";

export async function getCmsHeaderDoc(): Promise<CmsHeaderDoc | null> {
  const snap = await adminDb.doc(DOC_PATH).get();
  return snap.exists ? (snap.data() as CmsHeaderDoc) : null;
}

export async function saveCmsHeaderDoc(payload: CmsHeaderDoc) {
  await adminDb.doc(DOC_PATH).set(
    { ...payload, updatedAt: new Date() },
    { merge: true }
  );
}
