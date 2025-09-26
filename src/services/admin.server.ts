// src/services/admin.server.ts
import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  try {
    const res = await fetch(`/api/admin/header`, { cache: "no-store" });
    if (!res?.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  try {
    const res = await fetch(`/api/admin/home`, { cache: "no-store" });
    if (!res?.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
