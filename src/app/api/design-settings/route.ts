import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';

// This is an alternative to `revalidate: 0` and `cache: 'no-store'`
// It tells Next.js to always re-run this route handler on every request
export const dynamic = 'force-dynamic';

const SETTINGS_COLLECTION_ID = 'settings';
const SETTINGS_DOC_ID = 'general';
const PATH = `${SETTINGS_COLLECTION_ID}/${SETTINGS_DOC_ID}`;

export async function GET() {
  try {
    const snap = await adminDb.doc(PATH).get();
    if (!snap.exists) {
        return NextResponse.json({ ok: false, data: null, message: 'No design settings found.' }, { status: 404 });
    }
    return NextResponse.json({
        ok: true,
        data: snap.data(),
    }, { headers: { 'cache-control': 'no-store' }});
  } catch (error: any) {
    console.error('Error fetching design settings:', error);
    return NextResponse.json({ ok: false, data: null, error: error.message }, { status: 500 });
  }
}
