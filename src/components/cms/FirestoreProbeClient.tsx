"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db as getDb } from "@/lib/client/firebase";

type ProbeResult =
  | { ok: true }
  | { ok: false; code?: string; name?: string; message?: string };

export default function FirestoreProbeClient() {
  const [result, setResult] = useState<ProbeResult | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const _db = getDb();
        const ref = doc(_db, "cms/pages/header", "header");
        await getDoc(ref);
        if (active) setResult({ ok: true });
      } catch (e: any) {
        if (active)
          setResult({
            ok: false,
            code: e?.code,
            name: e?.name,
            message: String(e?.message ?? e),
          });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <pre className="text-xs p-3 bg-muted rounded overflow-auto">
      {JSON.stringify(result ?? { ok: false, message: "pending" }, null, 2)}
    </pre>
  );
}
