"use client";

import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(cfg);

let dbSingleton: Firestore | null = null;

export function db() {
  if (dbSingleton) return dbSingleton;
  try {
    dbSingleton = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    dbSingleton = getFirestore(app);
  }
  return dbSingleton;
}

// Renaming the function to avoid conflicts with the singleton accessor
export { db as getDb };
