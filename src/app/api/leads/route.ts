
import { getLeadsForClient } from '@/app/actions';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const leads = await getLeadsForClient();
        return NextResponse.json(leads);
    } catch (error) {
        console.error("Error in /api/leads route:", error);
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}
