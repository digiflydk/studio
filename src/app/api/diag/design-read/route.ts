
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { getAdminDb } from '@/lib/server/firebaseAdmin';
const PATH = 'settings/general';

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.doc(PATH).get();
    return NextResponse.json({
      ok: true,
      path: PATH,
      exists: snap.exists,
      data: snap.data() ?? null,
      serverRuntime: 'nodejs',
    }, { headers: { 'cache-control': 'no-store' }});
  } catch (error: any) {
    console.error('Diag Read Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
