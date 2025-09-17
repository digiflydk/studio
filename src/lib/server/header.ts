
// src/lib/server/header.ts
import { adminDb } from "@/lib/server/firebaseAdmin";

export async function getHeaderAppearance(): Promise<any | null> {
  const ref = adminDb.collection("cms").doc("pages").collection("header").doc("header");
  const snap = await ref.get();
  return snap.exists ? (snap.data() as any) : null;
}
