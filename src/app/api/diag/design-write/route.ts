
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { adminDb } from '@/lib/server/firebaseAdmin';
const PATH = 'settings/general';

export async function POST() {
  try {
    const now = new Date().toISOString();
    await adminDb.doc(PATH).set({ _diag: { lastWrite: now } }, { merge: true });
    const snap = await adminDb.doc(PATH).get();
    return NextResponse.json({
      ok: true,
      path: PATH,
      exists: snap.exists,
      lastWrite: now,
      serverRuntime: 'nodejs',
    }, { headers: { 'cache-control': 'no-store' }});
  } catch (error: any) {
    console.error('Diag Write Error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
