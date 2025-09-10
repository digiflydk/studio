
import * as admin from 'firebase-admin';

// This is a more robust singleton pattern for Firebase Admin initialization.
// It ensures that initialization happens only once and that adminDb is always
// a valid Firestore instance if no exception is thrown.

let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    // This check is critical. It throws a clear error if the environment variables are missing.
    if (!privateKey || !clientEmail || !projectId) {
      throw new Error('Firebase credentials are not set in the environment. Please check your .env file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error: any) {
    console.error("CRITICAL: Firebase Admin SDK initialization failed.", error);
    // We throw the error to stop the process if initialization fails.
    // This prevents downstream errors like "adminDb.doc is not a function".
    throw new Error(`Firebase Admin SDK could not be initialized: ${error.message}`);
  }
}

adminDb = admin.firestore();

export { adminDb };
