import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!serviceAccountBase64) {
    console.error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable not set. Skipping admin initialization.');
    // Mock the db to avoid crashes during build if env vars are not set
    adminDb = {} as admin.firestore.Firestore;
  } else {
    try {
      const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('ascii');
      const serviceAccount = JSON.parse(serviceAccountJson);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      adminDb = admin.firestore();
    } catch (error) {
       console.error('Failed to parse Firebase service account credentials. Make sure the Base64 string is correct.', error);
       adminDb = {} as admin.firestore.Firestore;
    }
  }
} else {
  adminDb = admin.firestore();
}

export { adminDb };
