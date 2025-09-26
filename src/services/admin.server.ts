const BASE = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "";

export async function getAdminHeader(): Promise<import("@/lib/types/admin").AdminHeaderDoc | null> {
  const res = await fetch(`${BASE}/api/admin/header`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export async function getAdminHome(): Promise<import("@/lib/types/admin").AdminHomeDoc | null> {
  const res = await fetch(`${BASE}/api/admin/home`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}
