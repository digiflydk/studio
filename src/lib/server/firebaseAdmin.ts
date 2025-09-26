
import { initializeApp, getApps, cert, applicationDefault, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

// Singleton-instanser for at undgå re-initialisering
let adminApp: App | null = null;
let adminDbInstance: Firestore | null = null;

/**
 * Initialiserer Firebase Admin App'en, hvis den ikke allerede eksisterer.
 * Denne funktion er designet til at være sikker at kalde flere gange.
 * @returns Den initialiserede Firebase App-instans.
 */
function initAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }
  
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  adminApp = initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  return adminApp;
}

/**
 * Giver adgang til en singleton Firestore-databaseinstans.
 * Initialiserer app'en, hvis det er nødvendigt.
 * @returns Firestore-instansen.
 */
function getAdminDb(): Firestore {
    if (adminDbInstance) {
        return adminDbInstance;
    }
    const app = initAdminApp();
    adminDbInstance = getFirestore(app);
    return adminDbInstance;
}

// Eksporter den singleton-databaseinstans til brug i hele applikationen.
export const adminDb = getAdminDb();

// Eksporter init-funktionen, hvis den skal bruges direkte (bør generelt ikke være nødvendigt).
export const initAdmin = initAdminApp;
