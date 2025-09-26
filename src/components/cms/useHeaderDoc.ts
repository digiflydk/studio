"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/client/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

export function useHeaderDoc() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ref = doc(db, "cms/pages/header", "header");

    // Realtime subscription
    const unsub = onSnapshot(
      ref,
      (snap) => setData(snap.data() ?? null),
      async (err) => {
        // Hvis stream fejler (fx 'unavailable'), fald tilbage til engangslæsning
        // så UI stadig har data
        console.error("header onSnapshot error:", err?.code || err?.message);
        try {
          const once = await getDoc(ref);
          setData(once.data() ?? null);
        } catch (e) {
          console.error("header getDoc fallback failed:", (e as any)?.code || e);
        }
      }
    );

    return () => unsub();
  }, []);

  return data;
}
