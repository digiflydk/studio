
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = adminDb;
  // Kanonisk doc
  const refGen = db.doc('settings/general');
  const snapGen = await refGen.get();

  if (!snapGen.exists) {
    return NextResponse.json({ ok: false, error: 'not_found', path: 'settings/general' }, { status: 404 });
  }

  const g = snapGen.data() as any;
  const version = typeof g.version === 'number' ? g.version : 0;
  const buttonSettings = g.buttonSettings ?? {};

  return NextResponse.json(
    { ok: true, data: { version, ...buttonSettings } }, // <- gør livet nemt for din Form: den får direkte button felter + version
    { headers: { 'cache-control': 'no-store' } }
  );
}
