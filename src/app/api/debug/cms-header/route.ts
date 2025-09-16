export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { getGeneralSettings } from "@/services/settings";
import { getWebsiteHeaderConfig } from "@/services/website";

export async function GET() {
  const [cmsSettingsSnap, legacyHeaderSnap, pageHeaderSnap, generalSettings, headerConfig] = await Promise.all([
    adminDb.collection("cms").doc("settings").get(),
    adminDb.collection("cms").doc("settings").collection("pages").doc("header").get(),
    adminDb.collection("cms").doc("pages").collection("header").doc("header").get(),
    getGeneralSettings(),
    getWebsiteHeaderConfig(),
  ]);

  const fire = {
    cms_settings_exists: cmsSettingsSnap.exists,
    cms_settings_data: cmsSettingsSnap.exists ? cmsSettingsSnap.data() : null,
    legacy_cms_settings_pages_header_exists: legacyHeaderSnap.exists,
    legacy_cms_settings_pages_header_data: legacyHeaderSnap.exists ? legacyHeaderSnap.data() : null,
    cms_pages_header_exists: pageHeaderSnap.exists,
    cms_pages_header_data: pageHeaderSnap.exists ? pageHeaderSnap.data() : null,
  };

  const service = { generalSettings, headerConfig };

  return NextResponse.json({ ok: true, fire, service });
}
