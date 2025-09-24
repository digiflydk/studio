import { getCmsHeaderDoc } from "@/services/cmsHeader";

export type WebsiteHeaderConfig = Awaited<ReturnType<typeof getCmsHeaderDoc>>;

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  return await getCmsHeaderDoc();
}
