import { adminDb } from "@/lib/server/firebaseAdmin";

type AnyObj = Record<string, any>;

export async function getCmsHeaderDoc(): Promise<AnyObj | null> {
  const p1 = adminDb.doc("cms/pages/header/header");
  const snap1 = await p1.get();
  if (snap1.exists) {
    const d = snap1.data() as AnyObj;
    return d || null;
  }
  const p2 = adminDb.doc("cms/pages/header");
  const snap2 = await p2.get();
  if (snap2.exists) {
    const d = snap2.data() as AnyObj;
    return d || null;
  }
  return null;
}
