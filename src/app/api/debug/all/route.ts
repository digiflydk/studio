// src/app/api/debug/all/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hjælper: læs et dokument og returnér en standardiseret struktur.
 */
async function readDoc(
  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  label: string
) {
  try {
    const snap = await ref.get();
    if (!snap.exists) {
      return { ok: true, exists: false, path: `${ref.path}`, raw: null };
    }
    return { ok: true, exists: true, path: `${ref.path}`, raw: snap.data() };
  } catch (e: any) {
    return {
      ok: false,
      exists: false,
      path: `${ref.path}`,
      error: "READ_ERROR",
      message: e?.message ?? "Unknown",
    };
  }
}

/**
 * NB: Vi samler de vigtigste kendte stier.
 * Hvis et dokument ikke findes i et projekt, returneres { exists:false }.
 * Listen kan nemt udvides senere uden breaking changes.
 */
export async function GET() {
  try {
    // ---- Settings
    const settingsGeneralRef = adminDb.collection("settings").doc("general");
    const sectionPaddingRef = adminDb.collection("settings").doc("sectionPadding"); // valgfri, hvis det findes
    const aiAssistantRef = adminDb.collection("settings").doc("aiAssistant"); // valgfri, hvis det findes

    // ---- CMS Pages
    const cmsHeaderRef = adminDb.collection("cms").doc("pages").collection("header").doc("header");
    const cmsHomeRef = adminDb.collection("cms").doc("pages").collection("home").doc("home");
    const cmsFooterRef = adminDb.collection("cms").doc("pages").collection("footer").doc("footer");

    // ---- CMS Data (andre sektioner - valgfri, men nyttige)
    const cmsTeamRef = adminDb.collection("cms").doc("team").doc("team");
    const cmsCustomersRef = adminDb.collection("cms").doc("customers").doc("customers");
    const cmsCasesRef = adminDb.collection("cms").doc("cases").doc("cases");
    const cmsServicesRef = adminDb.collection("cms").doc("services").doc("services");
    const cmsBlogRef = adminDb.collection("cms").doc("blog").doc("blog");

    // Læs alle i parallel
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
      readDoc(settingsGeneralRef, "settingsGeneral"),
      readDoc(sectionPaddingRef, "sectionPadding"),
      readDoc(aiAssistantRef, "aiAssistant"),
      readDoc(cmsHeaderRef, "cmsHeader"),
      readDoc(cmsHomeRef, "cmsHome"),
      readDoc(cmsFooterRef, "cmsFooter"),
      readDoc(cmsTeamRef, "team"),
      readDoc(cmsCustomersRef, "customers"),
      readDoc(cmsCasesRef, "cases"),
      readDoc(cmsServicesRef, "services"),
      readDoc(cmsBlogRef, "blog"),
    ]);

    // Afledte/normerede felter (frivilligt, men hjælper overblik)
    const derived: Record<string, any> = {};

    // Hvis sectionPadding ligger inde i settingsGeneral, eksponer også den struktur direkte.
    if (settingsGeneral?.ok && settingsGeneral?.exists && settingsGeneral.raw) {
      if (settingsGeneral.raw.sectionPadding) {
        derived.sectionPaddingFromSettingsGeneral = {
          ok: true,
          exists: true,
          source: "settings/general.sectionPadding",
          raw: settingsGeneral.raw.sectionPadding,
        };
      }

      // Header fra settings.general (nogle projekter har header-relaterede felter her)
      if (settingsGeneral.raw.header) {
        derived.headerFromSettingsGeneral = {
          ok: true,
          exists: true,
          source: "settings/general.header",
          raw: settingsGeneral.raw.header,
        };
      }
    }

    // Saml alt i én respons
    const payload = {
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
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "UNEXPECTED_ERROR",
        message: e?.message ?? "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true });
}
