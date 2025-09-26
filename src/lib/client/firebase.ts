"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  type Firestore,
  setLogLevel,
} from "firebase/firestore";

// Læs fra NEXT_PUBLIC_* envs
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Skru ned for støj fra SDK (valgfri: "error" eller "silent")
setLogLevel("error");

// I miljøer (App Hosting/proxy/corporate) fejler streaming → brug long-polling
export const db: Firestore = initializeFirestore(app, {
  // Lad SDK selv vælge long-polling, eller tving det i prod
  experimentalAutoDetectLongPolling: true,
  ...(process.env.NODE_ENV === "production" ? { experimentalForceLongPolling: true } : {}),
  ignoreUndefinedProperties: true,
});
