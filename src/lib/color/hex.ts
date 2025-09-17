export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export function rgbToCss(r: number, g: number, b: number, alpha = 1) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hslToCss(h: number, s: number, l: number, alpha = 1) {
  return `hsla(${h} ${s}% ${l}% / ${alpha})`;
}

export function pickBgCss(opts: {
  hex?: string;
  h?: number; s?: number; l?: number; opacity?: number;
}) {
  if (opts.hex) {
    const rgb = hexToRgb(opts.hex);
    if (rgb) return rgbToCss(rgb.r, rgb.g, rgb.b, opts.opacity ?? 1);
  }
  const { h = 0, s = 0, l = 100, opacity = 1 } = opts;
  return hslToCss(h, s, l, opacity);
}
