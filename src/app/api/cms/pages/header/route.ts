import { NextResponse } from "next/server";
import { getCmsHeaderDoc } from "@/services/cmsHeader";

export async function GET() {
  const data = await getCmsHeaderDoc();
  return NextResponse.json({ ok: true, data });
}
