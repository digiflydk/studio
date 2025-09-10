import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_CLIENT_EMAIL || !privateKey || !process.env.FIREBASE_PROJECT_ID) {
    console.error('Firebase admin environment variables not set. Skipping admin initialization.');
    // Mock the db to avoid crashes during build if env vars are not set
    adminDb = {} as admin.firestore.Firestore;
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
    });
    adminDb = admin.firestore();
  }
} else {
  adminDb = admin.firestore();
}

export { adminDb };
