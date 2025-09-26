"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, setLogLevel } from "firebase/firestore";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(cfg);

// 🔒 Slå den HELT over på long-polling (mere aggressivt end auto-detect)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  // ingen andre custom flags her – hold det minimalt for stabilitet
});

// midlertidigt: mere støj i konsollen for at se rigtige fejl
if (process.env.NODE_ENV !== "production") {
  setLogLevel("debug");
}
