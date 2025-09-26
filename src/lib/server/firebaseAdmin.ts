import { getApps, getApp, initializeApp, applicationDefault, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _adminApp: App | null = null;

export function initAdmin(): App {
  if (_adminApp) return _adminApp;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
  const json = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const b64  = process.env.GOOGLE_APPLICATION_CREDENTIALS_B64;

  let credentials: any = null;
  if (json) credentials = JSON.parse(json);
  else if (b64) credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));

  if (getApps().length) {
    _adminApp = getApp();
    return _adminApp;
  }

  _adminApp = initializeApp(
    credentials
      ? { credential: cert(credentials), projectId }
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
