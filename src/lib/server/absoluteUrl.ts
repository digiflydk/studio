// src/lib/server/absoluteUrl.ts
import { headers } from "next/headers";

export function absoluteUrl(path: string) {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  if (envBase) return new URL(path, envBase).toString();
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim();
  return `${proto}://${host}${path.startsWith("/") ? path : `/${path}`}`;
}
