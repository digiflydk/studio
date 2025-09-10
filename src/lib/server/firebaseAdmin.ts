// src/lib/server/firebaseAdmin.ts
// Robust Firebase Admin init for Node runtime (Next.js App Router)

import { getApps, getApp, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;
let _db: Firestore | null = null;

function ensureEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`[firebaseAdmin] Missing env ${name}`);
  }
  return v;
}

function initApp(): App {
  if (_app) return _app;
  const projectId = ensureEnv('FIREBASE_PROJECT_ID');
  const clientEmail = ensureEnv('FIREBASE_CLIENT_EMAIL');
  const privateKeyRaw = ensureEnv('FIREBASE_PRIVATE_KEY');
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n'); // important!

  _app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });

  return _app;
}

/** Preferred: get a Firestore instance when you need it */
export function getAdminDb(): Firestore {
  if (_db) return _db;
  const app = initApp();
  _db = getFirestore(app);
  return _db;
}

/** Backwards compatible constant (be sure to import as a **named** import) */
export const adminDb: Firestore = getAdminDb();