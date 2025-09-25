
"use server";

import { revalidatePath } from "next/cache";
import { getCmsHeaderDoc, saveCmsHeaderDoc } from "@/services/cmsHeader";
import type { CmsHeaderDoc } from "@/lib/types/cmsHeader";

export async function loadHeaderAction() {
  const doc = await getCmsHeaderDoc();
  return doc;
}

export async function saveHeaderAction(input: CmsHeaderDoc) {
  await saveCmsHeaderDoc(input);
  revalidatePath("/cms/pages/header");
  return { ok: true };
}
