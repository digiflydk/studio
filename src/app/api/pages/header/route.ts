
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = adminDb;
  const ref = db.doc('settings/general');
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ ok:false, error:'not_found' }, { status: 404 });
  const g = snap.data() as any;
  const version = typeof g.version === 'number' ? g.version : 0;
  const s = g.header?.cta ?? {};
  return NextResponse.json({ ok: true, data: { version, ...s }}, { headers: { 'cache-control': 'no-store' }});
}
