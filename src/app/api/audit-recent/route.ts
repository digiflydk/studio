import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function toPlainObject(obj: any) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj.toDate) { // Firestore Timestamp
        return obj.toDate().toISOString();
    }
    if (Array.isArray(obj)) {
        return obj.map(toPlainObject);
    }
    const plain: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            plain[key] = toPlainObject(obj[key]);
        }
    }
    return plain;
}


export async function GET() {
  const snap = await adminDb.collection('audit').orderBy('ts','desc').limit(20).get();
  const items = snap.docs.map(d => ({ id: d.id, ...toPlainObject(d.data()) }));
  return NextResponse.json({ ok: true, items }, { headers: { 'cache-control': 'no-store' }});
}
