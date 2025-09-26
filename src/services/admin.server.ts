// src/services/admin.server.ts
import "server-only";
import type { AdminHeaderDoc, AdminHomeDoc } from "@/lib/types/admin";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { Timestamp } from "firebase-admin/firestore";

const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

async function getJson(path: string) {
  const url = path.startsWith("http") ? path : `${ORIGIN}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}


export async function getAdminHeader(): Promise<AdminHeaderDoc | null> {
  try {
    return await getJson("/api/admin/header");
  } catch {
    return null;
  }
}

export async function getAdminHome(): Promise<AdminHomeDoc | null> {
  try {
    return await getJson("/api/admin/home");
  } catch {
    return null;
  }
}
