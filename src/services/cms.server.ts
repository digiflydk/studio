import "server-only";
import { adminDb } from "@/lib/server/firebaseAdmin";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";

export async function getCmsHeaderAppearanceServer(): Promise<CmsHeaderDoc | null> {
  const ref = adminDb.doc("cms/pages/header/header");
  const snap = await ref.get();
  return snap.exists ? (snap.data() as CmsHeaderDoc) : null;
}
