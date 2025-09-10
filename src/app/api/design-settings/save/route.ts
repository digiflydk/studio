
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { GeneralSettings } from '@/types/settings';
import { deepMerge } from '@/lib/utils/deepMerge';
import { stripUndefined } from '@/lib/utils/sanitize';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PATH = 'settings/general';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanPayload = stripUndefined(body);

    const ref = adminDb.doc(PATH);
    const snap = await ref.get();
    const currentData = snap.exists ? snap.data() : {};

    const mergedData = deepMerge(currentData as GeneralSettings, cleanPayload);
    (mergedData as any).updatedAt = new Date().toISOString();
    
    await ref.set(mergedData, { merge: true });

    revalidatePath('/', 'layout');
    revalidatePath('/cms', 'layout');
    revalidateTag('design-settings');

    const updatedSnap = await ref.get();
    const updatedData = updatedSnap.data();

    return NextResponse.json({ 
        ok: true, 
        message: 'Design settings saved.',
        data: updatedData,
    }, { headers: { 'cache-control': 'no-store' } });

  } catch (error: any) {
    console.error('Error saving design settings:', error);
    return NextResponse.json({ ok: false, message: 'An error occurred during saving.', error: error.message }, { status: 500 });
  }
}
