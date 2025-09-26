"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/client/firebase";
import { doc, getDoc } from "firebase/firestore";

export function useHeaderDoc() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, "cms/pages/header", "header");
        const snap = await getDoc(ref);      // one-shot read
        setData(snap.exists() ? snap.data() : null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}
