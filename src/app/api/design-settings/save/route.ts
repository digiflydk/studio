
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { GeneralSettings } from '@/types/settings';
import { txSaveVersioned } from '@/lib/server/versionedSave';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PATH = 'settings/general';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const author = request.headers.get('x-user') ?? 'studio';
    
    const res = await txSaveVersioned<Partial<GeneralSettings>>({ 
        path: PATH, 
        data: body,
        author: author,
    });
    
    if (!res.ok) {
        // Returnerer 409 conflict eller anden fejlstatus
        return NextResponse.json({ ok: false, error: res.error, data: res.current, version: res.currentVersion }, { status: res.status });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/cms', 'layout');
    revalidateTag('design-settings');

    return NextResponse.json({ 
        ok: true, 
        message: 'Design settings saved.',
        data: res.data,
    }, { headers: { 'cache-control': 'no-store' } });

  } catch (error: any)
{
    console.error('Error saving design settings:', error);
    return NextResponse.json({ ok: false, message: 'An error occurred during saving.', error: error.message }, { status: 500 });
  }
}
