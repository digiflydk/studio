// src/lib/client/firebase.ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  memoryLocalCache,               // enkel cache i memory
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Tving stabil transport og simpel cache.
// AUTO er fint i mange miljøer, men Workstations/proxies kræver ofte force long-polling.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: false,
  experimentalForceLongPolling: true,
  // Deaktiver fetch streams i proxy-miljøer (reducerer mærkelige fejl)
  useFetchStreams: false as any,   // v11 accepterer feltet, TS kan brokke sig -> cast
  localCache: memoryLocalCache(),
});
