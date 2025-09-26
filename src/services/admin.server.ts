// src/services/admin.server.ts
import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { getBaseUrl } from "./getBaseUrl.server";

export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/admin/header`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminHeaderDoc;
  } catch {
    return null;
  }
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/admin/home`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminHomeDoc;
  } catch {
    return null;
  }
}
