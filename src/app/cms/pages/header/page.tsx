'use client';
import { useEffect, useState } from 'react';
import { getCmsHeaderAppearance } from '@/services/cmsHeader';

export default function CmsHeaderPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getCmsHeaderAppearance().then((d) => {
      if (!alive) return;
      setData(d);
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  if (loading) return <div>Loading…</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Header Settings</h1>
      <pre className="rounded border bg-white p-4 shadow-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
