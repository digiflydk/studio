
"use server";
import { unstable_noStore as noStore } from "next/cache";
import { getGeneralSettings } from "@/services/settings";
import { getCmsHeaderDoc } from "@/services/cmsHeader";
import { linkClassFromInput } from "@/lib/colors";
import type { NavLink } from '@/types/settings';

export type HSL = { h: number, s: number, l: number, opacity: number };

export type WebsiteHeaderConfig = Awaited<ReturnType<typeof getCmsHeaderDoc>>;

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  return await getCmsHeaderDoc();
}
