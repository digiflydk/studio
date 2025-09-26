"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/client/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function HeaderEditorClient() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<unknown>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = getDb();
        const ref = doc(db, "cms/pages/header", "header");
        const snap = await getDoc(ref);
        setData(snap.exists() ? snap.data() : null);
      } catch (e) {
        setErr(e);
      }
    })();
  }, []);

  if (err) return <pre>Fejl: {String((err as Error).message || err)}</pre>;
  if (!data) return <div>Indlæser...</div>;

  // ...render your form fields here, based on `data`
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
