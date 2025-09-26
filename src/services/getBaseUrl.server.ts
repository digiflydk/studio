import { headers } from "next/headers";

/** Bygger en absolut base-URL på serversiden (dev, Vercel, Cloud Workstations) */
export function getBaseUrl(): string {
  const h = headers();
  const proto =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host =
    h.get("x-forwarded-host") ||
    h.get("host") ||
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.replace(/^https?:\/\//, "");

  if (!host) throw new Error("getBaseUrl: host is undefined");

  return `${proto}://${host}`;
}
