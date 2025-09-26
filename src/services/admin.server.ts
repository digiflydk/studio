import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { absoluteUrl } from "@/lib/server/absoluteUrl";

export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  const url = absoluteUrl("/api/admin/header");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as AdminHeaderDoc;
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  const url = absoluteUrl("/api/admin/home");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as AdminHomeDoc;
}
