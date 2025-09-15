'use client';

import { useMemo } from 'react';

export default function OpacitySlider({
  value01,
  onChange01,
  label,
}: {
  value01: number;
  onChange01: (v01: number) => void;
  label?: string;
}) {
  const value100 = useMemo(() => Math.round((value01 ?? 0) * 100), [value01]);
  return (
    <div className="flex flex-col gap-2">
      {label && <div className="text-sm font-medium">{label} ({value100}%)</div>}
      <input
        type="range"
        min={0}
        max={100}
        value={value100}
        onChange={(e) => {
          const v = Number(e.target.value);
          const v01 = Math.max(0, Math.min(1, v / 100));
          onChange01(v01);
        }}
      />
    </div>
  );
}
