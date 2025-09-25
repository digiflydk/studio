import "server-only";
import { adminDb } from "@/lib/server/firebaseAdmin";

export async function getCmsHeaderServer() {
  const ref = adminDb.doc("cms/pages/header/header");
  const snap = await ref.get();
  return snap.exists ? snap.data() : null;
}
