import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    console.error('Firebase environment variables (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID) not set. Skipping admin initialization.');
    // Mock the db to avoid crashes during build if env vars are not set
    adminDb = {} as admin.firestore.Firestore;
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: clientEmail,
          privateKey: privateKey, // dotenv handles the newline characters correctly when the key is quoted
          projectId: projectId,
        }),
      });
      adminDb = admin.firestore();
    } catch (error) {
       console.error('Failed to parse Firebase credentials. Make sure the environment variables are set correctly.', error);
       adminDb = {} as admin.firestore.Firestore;
    }
  }
} else {
  adminDb = admin.firestore();
}

export { adminDb };
