
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getAdminDb();
  const snap = await db.doc("settings/general").get();
  if (!snap.exists) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const g = snap.data() as any;
  const version = typeof g.version === "number" ? g.version : 0;

  const appearance = {
    headerHeight: g.headerHeight,
    headerLogoWidth: g.headerLogoWidth,
    headerNavLinks: g.headerNavLinks,
    headerTopBorderEnabled: g.headerTopBorderEnabled,
    headerTopBorderHeight: g.headerTopBorderHeight,
    headerTopBorderColor: g.headerTopBorderColor,
    headerInitialBackgroundColor: g.headerInitialBackgroundColor,
    headerInitialBackgroundOpacity: g.headerInitialBackgroundOpacity,
    headerScrolledBackgroundColor: g.headerScrolledBackgroundColor,
    headerScrolledBackgroundOpacity: g.headerScrolledBackgroundOpacity,
    version,
  };

  return NextResponse.json({ ok: true, data: appearance }, { headers: { "cache-control": "no-store" } });
}
