// components/providers/DesignVarsProvider.tsx
'use client';
import * as React from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { mapToCssVars } from '@/lib/design/mapToCssVars';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

export default function DesignVarsProvider() {
  React.useEffect(() => {
    if (!getApps().length) initializeApp(firebaseConfig);
    const db = getFirestore();
    const ref = doc(db, 'settings/general');
    const unsub = onSnapshot(ref, (snap) => {
      const data = (snap.data() || {}) as any;
      const vars = mapToCssVars(data);
      const root = document.documentElement;
      for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, String(v));
      window.dispatchEvent(new CustomEvent('design:updated', { detail: { source: 'cms' } }));
    });
    return () => unsub();
  }, []);

  return null;
}
