// app/api/settings/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getGeneralSettings } from '@/lib/firestore/settings';

export async function GET() {
  const data = await getGeneralSettings();
  return NextResponse.json({ ok: true, data }, { headers: { 'cache-control': 'no-store' } });
}
