'use client';

import { useEffect, useState } from 'react';
import { getCmsHeaderDoc } from '@/services/cmsHeader';

export default function CmsHeaderPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
        const res = await getCmsHeaderDoc();
        if (!alive) return;
        setData(res);
        setLoading(false);
    }
    fetchData();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div>Loading…</div>;
  
  const initial = (() => {
    if (!data) return null;
    if (data.appearance) return data.appearance;
    return data;
  })();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Header Settings</h1>
      <pre className="rounded border bg-white p-4 shadow-sm">
        {JSON.stringify(initial, null, 2)}
      </pre>
    </div>
  );
}
