
import { adminDb } from '@/lib/server/firebaseAdmin';
import { deepMerge } from '@/lib/utils/deepMerge';
import { stripUndefined } from '@/lib/utils/sanitize';
import { z } from 'zod';

type Opts<T> = {
  path: string;
  schema: z.ZodType<T>; // Schema is now required
  data: any;
  author?: string;
  mergeDeep?: boolean; // default true
};

type SuccessResponse<T> = {
    ok: true;
    data: T & { version: number; updatedAt: string; updatedBy: string };
    before: T | null;
};

type ErrorResponse = {
    ok: false;
    status: number;
    error: string;
    current: any;
    currentVersion: number;
};

export async function txSaveVersioned<T>({ path, schema, data, author='studio', mergeDeep=true }: Opts<T>): Promise<SuccessResponse<T> | ErrorResponse> {
  const ref = adminDb.doc(path);
  const clean = stripUndefined(data);
  
  const parsed = schema.parse(clean);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = new Date().toISOString();
    const current = snap.exists ? (snap.data() as any) : null;
    const currentVersion = Number(current?.version ?? 0);
    
    const clientVersion = Number(data?.version ?? 0);

    if (snap.exists && clientVersion !== currentVersion) {
      return { ok: false, status: 409, error: 'version_conflict', current, currentVersion };
    }

    const next = mergeDeep && current ? deepMerge(current, parsed) : parsed;
    
    (next as any).version = currentVersion + 1;
    (next as any).updatedAt = now;
    (next as any).updatedBy = author;

    tx.set(ref, next, { merge: false });
    
    return { ok: true, data: next, before: current };
  });
}
