
import { getApps, initializeApp, cert, applicationDefault, App } from "firebase-admin/app";
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _adminApp: App | null = null;

export function initAdmin(): App {
  if (_adminApp) return _adminApp;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  // Hvis du har service account som JSON i env:
  const svcJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (getApps().length === 0) {
    if (svcJson) {
      const creds = JSON.parse(svcJson);
      _adminApp = initializeApp({
        credential: cert(creds),
        projectId,
      });
    } else {
      _adminApp = initializeApp({
        credential: applicationDefault(),
        projectId,
      });
    }
  } else {
    _adminApp = getApps()[0]!;
  }

  return _adminApp!;
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
