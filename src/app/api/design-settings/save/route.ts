
import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { GeneralSettings } from '@/types/settings';
import { txSaveVersioned } from '@/lib/server/versionedSave';
import { z } from 'zod';
import { logAudit } from '@/lib/server/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PATH = 'settings/general';

// Define a schema for the specific settings this route can save
const designSettingsSchema = z.object({
  themeColors: z.any().optional(),
  typography: z.any().optional(),
  buttonSettings: z.any().optional(),
  version: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const author = request.headers.get('x-user') ?? 'studio';
    const ua = (request.headers.get('user-agent') || '').slice(0, 160);
    
    const res = await txSaveVersioned<Partial<GeneralSettings>>({ 
        path: PATH, 
        schema: designSettingsSchema,
        data: body,
        author: author,
    });
    
    if (!res.ok) {
        return NextResponse.json({ ok: false, error: res.error, data: res.current, version: res.currentVersion }, { status: res.status });
    }

    await logAudit({
      type: 'designSettings',
      path: PATH,
      ts: new Date().toISOString(),
      by: author,
      ua,
      version: res.data?.version,
      before: res.before,
      after: res.data,
    });

    revalidatePath('/', 'layout');
    revalidatePath('/cms', 'layout');
    revalidateTag('design-settings');

    return NextResponse.json({ 
        ok: true, 
        message: 'Design settings saved.',
        data: res.data,
    }, { headers: { 'cache-control': 'no-store' } });

  } catch (error: any) {
    console.error('Error saving design settings:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: 'Validation error.', error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: false, message: 'An error occurred during saving.', error: error.message }, { status: 500 });
  }
}
