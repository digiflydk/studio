"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/client/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { AdminHeaderDoc } from "@/lib/types/admin";

export default function AdminHeaderPage() {
  const [data, setData] = useState<AdminHeaderDoc | null>(null);
  const ref = doc(db, "admin/pages/header", "header");

  useEffect(() => {
    (async () => {
      const s = await getDoc(ref);
      setData(s.exists() ? (s.data() as AdminHeaderDoc) : null);
    })();
  }, []);

  if (!data) return <div>Loading…</div>;

  async function save() {
    await setDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: "admin"
    }, { merge: true });
    alert("Gemt");
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Header</h1>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span>Logo URL</span>
          <input className="border p-2" value={data.logo.src} onChange={e => setData({...data, logo:{...data.logo, src:e.target.value}})} />
        </label>

        <label className="grid gap-2">
          <span>CTA label</span>
          <input className="border p-2" value={data.cta.label} onChange={e => setData({...data, cta:{...data.cta, label:e.target.value}})} />
        </label>

        <label className="grid gap-2">
          <span>CTA link</span>
          <input className="border p-2" value={data.cta.href} onChange={e => setData({...data, cta:{...data.cta, href:e.target.value}})} />
        </label>

        <button onClick={save} className="px-4 py-2 rounded bg-black text-white">
          Gem ændring
        </button>
      </div>
    </div>
  );
}
