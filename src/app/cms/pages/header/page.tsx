"use client";

import { useEffect, useState } from "react";
import { getCmsHeaderClient } from "@/services/cmsHeader.client";

export default function CmsHeaderPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getCmsHeaderClient()
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch((e) => { if (alive) { setErr(e?.message || "Error"); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-6">Indlæser...</div>;
  if (err) return <div className="p-6 text-red-600">Fejl: {err}</div>;
  if (!data) return <div className="p-6">Ingen data i cms/pages/header</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">CMS Header</h1>
      <pre className="text-sm bg-muted p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
