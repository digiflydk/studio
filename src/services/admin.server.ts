// src/services/admin.server.ts
import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  try {
    const snap = await adminDb.doc("admin/pages/header/header").get();
    if (!snap.exists) return null;
    const data = snap.data() as any;
    if (data?.updatedAt instanceof Timestamp) data.updatedAt = data.updatedAt.toDate().toISOString();
    return data as AdminHeaderDoc;
  } catch {
    return null;
  }
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  try {
    const snap = await adminDb.doc("admin/pages/home/home").get();
    if (!snap.exists) return null;
    const data = snap.data() as any;
    if (data?.updatedAt instanceof Timestamp) data.updatedAt = data.updatedAt.toDate().toISOString();
    return data as AdminHomeDoc;
  } catch {
    return null;
  }
}
