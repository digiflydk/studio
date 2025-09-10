import { NextResponse } from 'next/server';
import { getHeaderSettings } from '@/lib/cms/pages-header';
export const runtime = 'nodejs'; 
export const dynamic = 'force-dynamic';
export async function GET(){ 
    const data = await getHeaderSettings(); 
    return NextResponse.json({ ok:true, data }, { headers:{'cache-control':'no-store'} }); 
}
