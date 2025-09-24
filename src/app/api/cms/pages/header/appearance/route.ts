import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export async function GET() {
  const doc = await adminDb.doc('cms/pages/header').get();
  const raw = doc.exists ? doc.data() : null;
  return NextResponse.json({ ok: true, data: raw?.appearance ?? null });
}
