
import { adminDb } from '@/lib/server/firebaseAdmin';
import { deepMerge } from '@/lib/utils/deepMerge';
import { stripUndefined } from '@/lib/utils/sanitize';

type Opts<T> = {
  path: string;
  schema: { parse: (v: any) => T }; // Schema is now required
  data: any;
  author?: string;
  mergeDeep?: boolean; // default true
};

export async function txSaveVersioned<T>({ path, schema, data, author='studio', mergeDeep=true }: Opts<T>) {
  const ref = adminDb.doc(path);
  const clean = stripUndefined(data);
  
  const parsed = schema.parse(clean);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = new Date().toISOString();
    const current = snap.exists ? (snap.data() as any) : {};
    const currentVersion = Number(current?.version ?? 0);
    
    // The version from the client is in the raw 'data' object before parsing/cleaning
    const clientVersion = Number(data?.version ?? 0);

    // Protect against lost updates
    if (snap.exists && clientVersion !== currentVersion) {
      return { ok: false as const, status: 409, error: 'version_conflict', current, currentVersion };
    }

    const next = mergeDeep ? deepMerge(current, parsed) : parsed;
    (next as any).version = currentVersion + 1;
    (next as any).updatedAt = now;
    (next as any).updatedBy = author;

    tx.set(ref, next, { merge: false }); // Use set with merge:false for a single source of truth
    return { ok: true as const, data: next };
  });
}
