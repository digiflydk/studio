// src/lib/server/absoluteUrl.ts
import { headers } from "next/headers";

export function absoluteUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;

  // Prøv at hente host/proto fra aktuelle request (virker i Server Components / Route Handlers)
  try {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (host) return `${proto}://${host}${path}`;
  } catch {
    // headers() er ikke altid tilgængelig (fx under build); falder tilbage nedenfor
  }

  // Fallback: miljøvariabel eller lokal dev
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${origin}${path}`;
}
