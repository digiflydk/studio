
// src/lib/server/header.ts
import { adminDb } from "@/lib/server/firebaseAdmin";

function toPlainObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // Firestore Timestamp
    if (typeof obj.toDate === 'function') {
        return obj.toDate().toISOString();
    }
    if (Array.isArray(obj)) {
        return obj.map(toPlainObject);
    }
    const plain: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            plain[key] = toPlainObject(obj[key]);
        }
    }
    return plain;
}


export async function getHeaderAppearance(): Promise<any | null> {
  const ref = adminDb.collection("cms").doc("pages").collection("header").doc("header");
  const snap = await ref.get();
  if (!snap.exists) {
    return null;
  }
  const data = snap.data();
  return toPlainObject(data);
}
