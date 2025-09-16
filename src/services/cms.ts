"use server";
import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { CMS_DOC_PAGES } from "@/lib/server/firestorePaths";

export type CmsHeaderDoc = {
  header?: {
    appearance?: {
      isOverlay?: boolean;
      headerIsSticky?: boolean;
      headerHeight?: number;
      headerLogoWidth?: number;
      headerLinkColor?: string;
      topBg?: { h: number; s: number; l: number; opacity?: number };
      scrolledBg?: { h: number; s: number; l: number; opacity?: number };
      border?: {
        enabled?: boolean;
        widthPx?: number;
        color?: { h: number; s: number; l: number; opacity?: number };
      };
      navLinks?: Array<{ label: string; href: string }>;
    };
  };
};

export async function getCmsHeaderPage(): Promise<CmsHeaderDoc["header"]["appearance"] | null> {
  noStore();
  const snap = await adminDb.collection(CMS_DOC_PAGES.collection).doc(CMS_DOC_PAGES.doc).get();
  const data = snap.exists ? (snap.data() as CmsHeaderDoc) : undefined;
  return data?.header?.appearance ?? null;
}
