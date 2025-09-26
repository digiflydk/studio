// src/lib/firestore/serialize.ts
import type { Timestamp as AdminTimestamp } from "firebase-admin/firestore";
import type { Timestamp as ClientTimestamp } from "firebase/firestore";

/**
 * Recursively converts Firestore Timestamp/Date/Map-like values to JSON-safe plain objects.
 * - Timestamp => ISO string
 * - Date => ISO string
 * - Arrays/objects => deep walk
 */
export function serializeFirestore<T = unknown>(value: T): T {
  if (value == null) return value;

  // Admin SDK Timestamp
  if (isAdminTimestamp(value)) {
    return value.toDate().toISOString() as unknown as T;
  }

  // Web SDK Timestamp
  if (isClientTimestamp(value)) {
    return value.toDate().toISOString() as unknown as T;
  }

  if (value instanceof Date) {
    return value.toISOString() as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((v) => serializeFirestore(v)) as unknown as T;
  }

  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serializeFirestore(v);
    }
    return out as unknown as T;
  }

  return value;
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  if (typeof x !== "object" || x === null) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}

function isAdminTimestamp(x: unknown): x is AdminTimestamp {
  // duck typing to avoid hard import coupling
  return !!x && typeof x === "object" && "toDate" in (x as any) && "seconds" in (x as any) && "nanoseconds" in (x as any);
}

function isClientTimestamp(x: unknown): x is ClientTimestamp {
  return !!x && typeof x === "object" && "toDate" in (x as any) && "seconds" in (x as any) && "nanoseconds" in (x as any);
}
