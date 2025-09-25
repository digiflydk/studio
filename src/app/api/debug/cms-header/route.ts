import { NextResponse } from 'next/server';
import { getWebsiteHeaderConfig } from '@/services/website.server';

export async function GET() {
  const config = await getWebsiteHeaderConfig();
  return NextResponse.json({ ok: true, config });
}
