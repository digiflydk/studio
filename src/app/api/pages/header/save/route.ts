import { NextResponse } from 'next/server';
import { headerSettingsSchema } from '@/lib/validators/headerSettings.zod';
import { saveHeaderSettings } from '@/lib/cms/pages-header';
import { revalidateTag } from 'next/cache';

export const runtime='nodejs'; 
export const dynamic='force-dynamic';

export async function POST(req: Request){
  try {
    const body = await req.json();
    const parsed = headerSettingsSchema.parse(body);
    const data = await saveHeaderSettings(parsed);
    revalidateTag('pages:header');
    return NextResponse.json({ ok:true, data }, { headers:{'cache-control':'no-store'} });
  } catch (error: any) {
    console.error("Error saving header settings:", error);
    return NextResponse.json({ ok: false, message: 'An error occurred during saving.', error: error.message }, { status: 500 });
  }
}
