
import { getApps, getApp, initializeApp, applicationDefault, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _adminApp: App | null = null;

export function initAdmin(): App {
  if (_adminApp) return _adminApp;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  const svc = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (getApps().length) {
    _adminApp = getApp(); // brug eksisterende
    return _adminApp;
  }

  _adminApp = initializeApp(
    svc
      ? { credential: cert(JSON.parse(svc)), projectId }
      : { credential: applicationDefault(), projectId }
  );

  return _adminApp;
}


let adminDbInstance: Firestore | null = null;

function getAdminDb(): Firestore {
    if (adminDbInstance) {
        return adminDbInstance;
    }
    const app = initAdmin();
    adminDbInstance = getFirestore(app);
    return adminDbInstance;
}

export const adminDb = getAdminDb();
