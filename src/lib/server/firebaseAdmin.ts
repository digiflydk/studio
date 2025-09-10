import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore;

if (admin.apps.length === 0) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
      throw new Error('Firebase environment variables (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_PROJECT_ID) must be set.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        projectId: projectId,
      }),
    });

    adminDb = admin.firestore();
    
  } catch (error: any) {
     console.error('CRITICAL: Failed to initialize Firebase Admin SDK. Ensure FIREBASE_... environment variables are set correctly.', error.message);
     // In a real production environment, you might want to exit the process
     // process.exit(1);
     // For now, we will let it crash on usage to make the error visible.
     adminDb = {} as admin.firestore.Firestore;
  }
} else {
  adminDb = admin.firestore();
}

export { adminDb };
