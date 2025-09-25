import { NextResponse } from "next/server";
import { getWebsiteHeaderConfig } from "@/services/website";

export async function GET() {
  const cfg = await getWebsiteHeaderConfig();
  return NextResponse.json({ ok: true, header: cfg });
}
