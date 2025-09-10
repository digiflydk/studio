
import { NextResponse } from 'next/server';
import { headerSettingsSchema, HeaderCTASettings } from '@/lib/validators/headerSettings.zod';
import { revalidateTag } from 'next/cache';
import { txSaveVersioned } from '@/lib/server/versionedSave';
import { logAudit } from '@/lib/server/audit';

export const runtime='nodejs'; 
export const dynamic='force-dynamic';

const PATH = 'pages/header';

export async function POST(req: Request){
  try {
    const body = await req.json();
    const author = req.headers.get('x-user') ?? 'studio';
    const ua = (req.headers.get('user-agent') || '').slice(0, 160);

    const res = await txSaveVersioned<HeaderCTASettings>({
      path: PATH,
      schema: headerSettingsSchema,
      data: body,
      author,
    });

    if (!res.ok) {
        return NextResponse.json({ ok: false, error: res.error, data: res.current, version: res.currentVersion }, { status: res.status });
    }
    
    await logAudit({
      type: 'headerSettings',
      path: PATH,
      ts: new Date().toISOString(),
      by: author,
      ua,
      version: res.data?.version,
      before: res.before,
      after: res.data,
    });

    revalidateTag('pages:header');

    return NextResponse.json({ ok: true, data: res.data }, { headers:{'cache-control':'no-store'} });

  } catch (e: any) {
     // If Zod validation fails, it will throw an error which is caught here.
     return NextResponse.json({ ok:false, error: e?.message ?? 'save_failed', issues: e.issues }, { status: 400 });
  }
}
