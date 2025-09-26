"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/client/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AdminHomeDoc } from "@/lib/types/admin";

export default function AdminHomePage() {
  const [data, setData] = useState<AdminHomeDoc | null>(null);
  const _db = getDb();
  const ref = doc(_db, "admin/pages/home", "home");

  useEffect(() => {
    (async () => {
      const s = await getDoc(ref);
      setData(s.exists() ? (s.data() as AdminHomeDoc) : null);
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
      <h1 className="text-2xl font-semibold mb-4">Forside · Hero</h1>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span>Overskrift</span>
          <input className="border p-2" value={data.hero.headline} onChange={e => setData({...data, hero:{...data.hero, headline:e.target.value}})} />
        </label>

        <label className="grid gap-2">
          <span>Beskrivelse</span>
          <textarea className="border p-2" value={data.hero.description} onChange={e => setData({...data, hero:{...data.hero, description:e.target.value}})} />
        </label>

        <label className="grid gap-2">
          <span>CTA tekst</span>
          <input className="border p-2" value={data.hero.ctaText} onChange={e => setData({...data, hero:{...data.hero, ctaText:e.target.value}})} />
        </label>

        <label className="grid gap-2">
          <span>CTA link</span>
          <input className="border p-2" value={data.hero.ctaLink} onChange={e => setData({...data, hero:{...data.hero, ctaLink:e.target.value}})} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-2">
            <span>Image TL (portrait)</span>
            <input className="border p-2" value={data.hero.images.tl} onChange={e => setData({...data, hero:{...data.hero, images:{...data.hero.images, tl:e.target.value}}})} />
          </label>
          <label className="grid gap-2">
            <span>Image TR (square)</span>
            <input className="border p-2" value={data.hero.images.tr} onChange={e => setData({...data, hero:{...data.hero, images:{...data.hero.images, tr:e.target.value}}})} />
          </label>
          <label className="grid gap-2">
            <span>Image BL (square)</span>
            <input className="border p-2" value={data.hero.images.bl} onChange={e => setData({...data, hero:{...data.hero, images:{...data.hero.images, bl:e.target.value}}})} />
          </label>
          <label className="grid gap-2">
            <span>Image BR (portrait)</span>
            <input className="border p-2" value={data.hero.images.br} onChange={e => setData({...data, hero:{...data.hero, images:{...data.hero.images, br:e.target.value}}})} />
          </label>
        </div>

        <button onClick={save} className="px-4 py-2 rounded bg-black text-white">
          Gem ændring
        </button>
      </div>
    </div>
  );
}
