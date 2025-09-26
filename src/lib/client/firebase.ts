// src/lib/client/firebase.ts
"use client";

import { initializeApp, getApp, getApps } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import {
  initializeFirestore,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Global guard so we NEVER initialize Firestore twice.
const g = globalThis as any;

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Return one and the same Firestore instance.
 * The first call creates initializeFirestore(...) with our options.
 * Subsequent calls return the same instance.
 */
export function getDb(): Firestore {
  if (!g.__DIGIFLY_DB__) {
    const app = getFirebaseApp();
    g.__DIGIFLY_DB__ = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: false,
      experimentalForceLongPolling: true,
      // Cast due to types in v11 - the field is used at runtime
      useFetchStreams: false as any,
      localCache: memoryLocalCache(),
    });
  }
  return g.__DIGIFLY_DB__ as Firestore;
}
