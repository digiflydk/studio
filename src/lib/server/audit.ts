
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { AuditRecord } from '@/types/audit';

function shallowDiff(a: any = {}, b: any = {}) {
  const keys = Array.from(new Set([...Object.keys(a||{}), ...Object.keys(b||{})]));
  const out: Record<string, { from: any; to: any }> = {};
  for (const k of keys) {
    const av = (a as any)?.[k];
    const bv = (b as any)?.[k];
    if (JSON.stringify(av) !== JSON.stringify(bv)) {
        out[k] = { from: av, to: bv };
    }
  }
  return out;
}

export async function logAudit<T>(record: AuditRecord<T>) {
  try {
    // cap payload size (50KB) ved at nøjes med diff
    const afterStr = JSON.stringify(record.after ?? {});
    const size = Buffer.byteLength(afterStr, 'utf8');
    
    const diff = shallowDiff(record.before, record.after);

    // Only log if there are actual changes
    if (Object.keys(diff).length === 0 && record.version !== 1) {
        return;
    }

    const trimmed: Omit<AuditRecord, 'before' | 'after'> & { size: number; diff: Record<string, {from: any, to: any}>} = { 
        type: record.type,
        path: record.path,
        ts: record.ts,
        by: record.by,
        ua: record.ua,
        version: record.version,
        size, 
        diff,
    };
    
    await adminDb.collection('audit').add(trimmed as any);
  } catch(e) { 
    console.error("AUDIT_LOG_FAILED", e);
    /* no-op: audit må aldrig blokere gemning */ 
  }
}
