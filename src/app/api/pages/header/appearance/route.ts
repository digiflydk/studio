
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { getGeneralSettings } from "@/services/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getGeneralSettings();
    if (!settings) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    const version = (settings as any).version ?? 0;
    const appearance = settings.header ?? {};

    return NextResponse.json({ ok: true, data: { ...appearance, version } }, { headers: { "cache-control": "no-store" } });
  } catch (error: any) {
    console.error("Error fetching header appearance:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
