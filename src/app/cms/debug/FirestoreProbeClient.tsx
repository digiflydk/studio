"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function FirestoreProbeClient() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "cms/pages/header", "header"));
        setResult({ ok: true, exists: snap.exists(), data: snap.data() ?? null });
      } catch (e: any) {
        setResult({
          ok: false,
          code: e?.code,
          name: e?.name,
          message: e?.message,
          stack: e?.stack?.slice(0, 500),
        });
      }
    })();
  }, []);

  return (
    <pre className="text-xs p-3 bg-muted rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>
  );
}
