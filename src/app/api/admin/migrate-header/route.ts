
import { NextResponse } from 'next/server';
import { migrateHeaderAppearance } from '../../../../../scripts/migrateHeaderAppearance';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
    if (process.env.ALLOW_HEADER_MIGRATION !== '1') {
        return NextResponse.json({ ok: false, error: 'Migration not enabled. Set ALLOW_HEADER_MIGRATION=1 in your environment.' }, { status: 403 });
    }

    try {
        const result = await migrateHeaderAppearance();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Migration failed:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
