"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/client/firebase";

type ProbeResult =
  | { ok: true }
  | { ok: false; code?: string; name?: string; message?: string };

export default function FirestoreProbe() {
  const [result, setResult] = useState<ProbeResult | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const ref = doc(db, "cms/pages/header", "header");
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
    <pre className="rounded-md bg-blue-50 p-4 text-xs leading-5">
      {JSON.stringify(result ?? { ok: false, message: "pending" }, null, 2)}
    </pre>
  );
}
