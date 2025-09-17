// src/app/api/debug/all/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Læs et dokument med ensartet struktur i svaret */
async function readDoc(ref: FirebaseFirestore.DocumentReference) {
  try {
    const snap = await ref.get();
    if (!snap.exists) {
      return { ok: true, exists: false, path: ref.path, raw: null };
    }
    return { ok: true, exists: true, path: ref.path, raw: snap.data() };
  } catch (e: any) {
    return {
      ok: false,
      exists: false,
      path: ref.path,
      error: "READ_ERROR",
      message: e?.message ?? "Unknown",
    };
  }
}

export async function GET() {
  try {
    // ---------- SETTINGS (rodsamling 'settings')
    const settingsGeneralRef   = adminDb.collection("settings").doc("general");
    const sectionPaddingRef    = adminDb.collection("settings").doc("sectionPadding"); // hvis findes
    const aiAssistantRef       = adminDb.collection("settings").doc("aiAssistant");    // hvis findes

    // ---------- CMS PAGES (hierarki: cms/pages/{page}/{doc})
    const cmsHeaderRef         = adminDb.collection("cms").doc("pages").collection("header").doc("header");
    const cmsHomeRef           = adminDb.collection("cms").doc("pages").collection("home").doc("home");
    const cmsFooterRef         = adminDb.collection("cms").doc("pages").collection("footer").doc("footer");

    // ---------- CMS DATA (flade dokumenter: cms/{bucket})
    const cmsTeamRef           = adminDb.collection("cms").doc("team");
    const cmsCustomersRef      = adminDb.collection("cms").doc("customers");
    const cmsCasesRef          = adminDb.collection("cms").doc("cases");
    const cmsServicesRef       = adminDb.collection("cms").doc("services");
    const cmsBlogRef           = adminDb.collection("cms").doc("blog");

    const [
      settingsGeneral,
      sectionPadding,
      aiAssistant,
      cmsHeader,
      cmsHome,
      cmsFooter,
      cmsTeam,
      cmsCustomers,
      cmsCases,
      cmsServices,
      cmsBlog,
    ] = await Promise.all([
      readDoc(settingsGeneralRef),
      readDoc(sectionPaddingRef),
      readDoc(aiAssistantRef),
      readDoc(cmsHeaderRef),
      readDoc(cmsHomeRef),
      readDoc(cmsFooterRef),
      readDoc(cmsTeamRef),
      readDoc(cmsCustomersRef),
      readDoc(cmsCasesRef),
      readDoc(cmsServicesRef),
      readDoc(cmsBlogRef),
    ]);

    // ---------- Afledt overblik (valgfrit)
    const derived: Record<string, any> = {};
    if (settingsGeneral?.ok && settingsGeneral?.exists && settingsGeneral.raw) {
      if (settingsGeneral.raw.sectionPadding) {
        derived.sectionPaddingFromSettingsGeneral = {
          ok: true,
          exists: true,
          source: "settings/general.sectionPadding",
          raw: settingsGeneral.raw.sectionPadding,
        };
      }
      if (settingsGeneral.raw.header) {
        derived.headerFromSettingsGeneral = {
          ok: true,
          exists: true,
          source: "settings/general.header",
          raw: settingsGeneral.raw.header,
        };
      }
    }

    return NextResponse.json(
      {
        ok: true,
        timestamp: new Date().toISOString(),
        data: {
          settingsGeneral,
          sectionPadding,
          aiAssistant,
          cmsHeader,
          cmsHome,
          cmsFooter,
          team: cmsTeam,
          customers: cmsCustomers,
          cases: cmsCases,
          services: cmsServices,
          blog: cmsBlog,
          derived,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "UNEXPECTED_ERROR", message: e?.message ?? "Unknown" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
