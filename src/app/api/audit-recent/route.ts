import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const snap = await adminDb.collection('audit').orderBy('ts','desc').limit(20).get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ ok: true, items }, { headers: { 'cache-control': 'no-store' }});
}
