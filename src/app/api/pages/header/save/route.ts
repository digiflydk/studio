import { NextResponse } from 'next/server';
import { headerSettingsSchema } from '@/lib/validators/headerSettings.zod';
import { revalidateTag } from 'next/cache';
import { txSaveVersioned } from '@/lib/server/versionedSave';
import { HeaderCTASettings } from '@/types/settings';

export const runtime='nodejs'; 
export const dynamic='force-dynamic';

const PATH = 'pages/header';

export async function POST(req: Request){
  try {
    const body = await req.json();
    const author = req.headers.get('x-user') ?? 'studio';

    const res = await txSaveVersioned<HeaderCTASettings>({
      path: PATH,
      schema: headerSettingsSchema,
      data: body,
      author,
    });

    if (!res.ok) {
        return NextResponse.json({ ok: false, error: res.error, data: res.current, version: res.currentVersion }, { status: res.status });
    }
    
    revalidateTag('pages:header');

    return NextResponse.json({ ok: true, data: res.data }, { headers:{'cache-control':'no-store'} });

  } catch (e: any) {
     return NextResponse.json({ ok:false, error: e?.message ?? 'save_failed' }, { status: 400 });
  }
}
