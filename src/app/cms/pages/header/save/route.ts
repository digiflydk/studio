
import { NextResponse } from "next/server";
import { saveHeaderAction } from "../actions";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";

export async function POST(req: Request) {
  try {
    const body: CmsHeaderDoc = await req.json();
    await saveHeaderAction(body);
    return NextResponse.json({ ok: true });
  } catch(e) {
    return NextResponse.json({ ok: false, error: "Invalid request body"}, { status: 400 });
  }
}
