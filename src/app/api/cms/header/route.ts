import { NextResponse } from "next/server";
import { getCmsHeaderServer } from "@/services/cmsHeader.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getCmsHeaderServer();
  return NextResponse.json({ ok: true, data });
}
