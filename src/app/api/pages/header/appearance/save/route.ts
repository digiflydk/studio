
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { headerAppearanceSchema } from "@/lib/validators/headerAppearance.zod";
import { logAudit } from "@/lib/server/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const db = adminDb;
  const body = await req.json();
  const clientVersion = Number(body?.version ?? 0);
  
  // Fjerner version før validering for at undgå at Zod brokker sig
  const { version, ...dataToParse } = body;
  const parsed = headerAppearanceSchema.parse(dataToParse);

  const ref = db.doc("settings/general");
  
  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const now = new Date().toISOString();
      const current = snap.exists ? (snap.data() as any) : {};
      const serverVersion = Number(current?.version ?? 0);

      if (snap.exists && clientVersion !== serverVersion) {
        return { ok: false as const, status: 409, error: "version_conflict", current, currentVersion: serverVersion };
      }

      const next = {
        ...current,
        header: {
            ...(current.header ?? {}),
            ...parsed
        },
        version: serverVersion + 1,
        updatedAt: now,
        updatedBy: "cms-user", // eller hent fra headers hvis muligt
      };
      
      tx.set(ref, next, { merge: false });
      return { ok: true as const, data: next, before: current };
    });

    if (!result.ok) {
        return NextResponse.json(result, { status: result.status ?? 400 });
    }
    
    // Audit logging (fire-and-forget)
    logAudit({
        type: 'headerSettings',
        path: ref.path,
        by: 'cms-user',
        ua: req.headers.get('user-agent'),
        before: result.before,
        after: result.data,
        version: result.data.version,
    });

    const g = result.data as any;
    const payload = {
      ...(g.header ?? {}),
      version: g.version ?? 0,
    };
    
    return NextResponse.json({ ok: true, data: payload }, { headers: { "cache-control": "no-store" } });

  } catch (error: any) {
    console.error("Header appearance save failed:", error);
    if (error.name === 'ZodError') {
        return NextResponse.json({ ok: false, error: 'Validation failed', issues: error.errors }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
}
