
import { initializeApp, getApps, cert, applicationDefault, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;

export function initAdmin(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0]!;
    return _app;
  }

  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) {
    const json = JSON.parse(inline);
    _app = initializeApp({ credential: cert(json) });
    return _app;
  }

  // Fallback til ADC (Google-miljøer: Cloud, Workstations, etc.)
  _app = initializeApp({ credential: applicationDefault() });
  return _app;
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
