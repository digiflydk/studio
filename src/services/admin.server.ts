// src/services/admin.server.ts
import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

function baseUrl(): string {
  // Lokal dev fallback
  const fallback = "http://localhost:3000";
  // Vercel / Cloud: brug VERCEL_URL hvis sat
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  // Evt. manuel override
  const manual = process.env.NEXT_PUBLIC_SITE_ORIGIN || null;
  return manual || vercel || fallback;
}


export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  try {
    const url = `${baseUrl()}/api/admin/header`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminHeaderDoc;
  } catch {
    return null;
  }
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  try {
    const url = `${baseUrl()}/api/admin/home`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AdminHomeDoc;
  } catch {
    return null;
  }
}
