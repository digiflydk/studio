// src/lib/colors/resolveColor.ts
export type Hsl = { h?: number; s?: number; l?: number };
export function hslToCss(hsl?: Hsl, opacity: number = 1): string | null {
  if (hsl?.h == null || hsl?.s == null || hsl?.l == null) return null;
  const s = clamp(hsl.s, 0, 100);
  const l = clamp(hsl.l, 0, 100);
  const o = clamp(opacity, 0, 1);
  return `hsla(${hsl.h}, ${s}%, ${l}%, ${o})`;
}
export function hexToRgba(hex?: string, opacity: number = 1): string | null {
  if (!hex) return null;
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let r = 0, g = 0, b = 0;
  const h = m[1];
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
  } else {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }
  const o = clamp(opacity, 0, 1);
  return `rgba(${r}, ${g}, ${b}, ${o})`;
}
export function resolveBgColor({
  hex,
  hsl,
  opacity,
}: {
  hex?: string;
  hsl?: Hsl;
  opacity?: number; // 0..1
}): string | null {
  if (hex) return hexToRgba(hex, opacity ?? 1);
  return hslToCss(hsl, opacity ?? 1);
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Number(n)));
}
