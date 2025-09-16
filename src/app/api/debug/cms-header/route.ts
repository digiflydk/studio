
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { getGeneralSettings } from "@/services/settings";
import { getWebsiteHeaderConfig } from "@/services/website";

export async function GET() {
  const [cmsSettingsSnap, cmsHeaderSnap, generalSettings, headerConfig] = await Promise.all([
    adminDb.collection("cms").doc("settings").get(),
    adminDb.collection("cms").doc("settings").collection("pages").doc("header").get(),
    getGeneralSettings(),
    getWebsiteHeaderConfig(),
  ]);

  const fire = {
    cms_settings_exists: cmsSettingsSnap.exists,
    cms_settings_data: cmsSettingsSnap.exists ? cmsSettingsSnap.data() : null,
    cms_page_header_exists: cmsHeaderSnap.exists,
    cms_page_header_data: cmsHeaderSnap.exists ? cmsHeaderSnap.data() : null,
  };

  const service = {
    generalSettings,
    headerConfig,
  };

  return NextResponse.json({ ok: true, fire, service });
}
