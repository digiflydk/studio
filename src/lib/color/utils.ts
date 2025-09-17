
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function effectiveColorHex(opt: {
  hex?: string | null;
  h?: number; s?: number; l?: number;
  opacity?: number;
}): string | null {
  const hex = opt.hex?.trim();
  if (hex) return hex;
  if (typeof opt.h === "number" && typeof opt.s === "number" && typeof opt.l === "number") {
    return hslToHex(opt.h, opt.s, opt.l);
  }
  return null;
}
