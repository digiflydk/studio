import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App;
if (getApps().length === 0) {
  try {
    const serviceAccount = process.env.FIREBASE_PRIVATE_KEY
      ? {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }
      : null;

    app = initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
  } catch (e: any) {
     console.error('Firebase Admin Initialization Error', e.stack);
     // If it fails here, it's a server configuration issue.
     // Let's not throw, but Firestore calls will fail.
     app = getApps()[0]!;
  }

} else {
  app = getApps()[0]!;
}

export const adminDb: Firestore = getFirestore(app);
