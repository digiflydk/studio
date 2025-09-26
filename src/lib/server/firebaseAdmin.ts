import { getApps, initializeApp, cert, applicationDefault, App } from "firebase-admin/app";

let _app: App | null = null;

export function initAdmin(): App {
  if (_app) return _app;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }
  
  if (process.env.FIREBASE_ADMIN_KEY) {
    _app = initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
      projectId,
    });
  } else {
    _app = initializeApp({
      credential: applicationDefault(),
      projectId,
    });
  }

  return _app;
}

let adminDbInstance: import("firebase-admin/firestore").Firestore | null = null;

function getAdminDb(): import("firebase-admin/firestore").Firestore {
    if (adminDbInstance) {
        return adminDbInstance;
    }
    const app = initAdmin();
    const { getFirestore } = require("firebase-admin/firestore");
    adminDbInstance = getFirestore(app);
    return adminDbInstance;
}

export const adminDb = getAdminDb();
