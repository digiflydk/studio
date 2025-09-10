// src/lib/ui/applyDesignVars.ts
// Robust variabel-apply der virker med både "settings/general" (buttonSettings)
// og eventuelle legacy-felter ("buttons")

export type AnyGeneral =
  | { buttonSettings?: any; themeColors?: any; typography?: any }
  | { buttons?: any; themeColors?: any; typography?: any }
  | Record<string, any>; // tillad også fladt "buttonSettings"

function ensureStyleEl(id = 'theme-vars') {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  return el!;
}

// --- uddrag i src/lib/ui/applyDesignVars.ts ---
function px(n?: number, fallback: number) {
  return `${typeof n === 'number' && !Number.isNaN(n) ? n : fallback}px`;
}
function hslObjToCss(c?: { h: number; s: number; l: number }, fallback = 'rgba(0,0,0,.08)') {
  if (!c || typeof c.h !== 'number') return fallback;
  const s = `${Math.max(0, Math.min(100, c.s))}%`;
  const l = `${Math.max(0, Math.min(100, c.l))}%`;
  return `hsl(${c.h} ${s} ${l})`;
}

function pickButtonBlock(g: AnyGeneral) {
  // 1) nyt skema: settings/general.buttonSettings
  if ((g as any)?.buttonSettings) return (g as any).buttonSettings;
  // 2) legacy: designSettings.buttons
  if ((g as any)?.buttons) return (g as any).buttons;
  // 3) hvis nogen kalder med selve buttonSettings-objektet
  //    (fx efter POST /api/design-settings/save som returnerer fladt payload)
  const maybe = g as any;
  if (maybe?.colors || maybe?.designType || maybe?.defaultVariant) return maybe;
  return {};
}

export function applyDesignVars(general: any) {
  const btn = pickButtonBlock(general || {});
  
  // Farver
  const primary = btn?.colors?.primary ?? '#2563EB';
  const hover = btn?.colors?.hover ?? primary;

  // Radius/shape: “designType” (ny) eller “shape” (legacy)
  const designType = btn?.designType ?? btn?.shape; // 'pill' | 'default'
  const radius =
    designType === 'pill'
      ? '9999px'
      : '8px'; // “default” → let afrundet

  // Font
  const fontFamily = btn?.fontFamily ?? 'inherit';
  const fontWeight = btn?.fontWeight ?? 600;

  // ----- HEADER (NY) -----
  const header = general || {};
  const height = header.headerHeight;                   // fx 100
  const logoW = header.headerLogoWidth;                 // fx 150
  const topBorderOn = header.headerTopBorderEnabled;    // bool
  const topBorderH = header.headerTopBorderHeight;      // fx 2
  const topBorderC = header.headerTopBorderColor;       // {h,s,l}

  const initialBgC = header.headerInitialBackgroundColor;   // {h,s,l}
  const initialBgO = header.headerInitialBackgroundOpacity; // 0..100
  const scrolledBgC = header.headerScrolledBackgroundColor; // {h,s,l}
  const scrolledBgO = header.headerScrolledBackgroundOpacity;

  const css = `
  :root{
    --btn-color-primary: ${primary};
    --btn-color-hover: ${hover};
    --btn-shape: ${radius};
    --btn-font: ${fontFamily};
    --btn-font-weight: ${fontWeight};

    --header-h: ${px(height, 72)};
    --header-logo-w: ${px(logoW, 140)};
    --header-border-h: ${px(topBorderH, 1)};
    --header-border-color: ${hslObjToCss(topBorderC)};
    --header-border-enabled: ${topBorderOn ? 1 : 0};

    --header-bg-initial: ${hslObjToCss(initialBgC, 'white')};
    --header-bg-initial-alpha: ${(typeof initialBgO === 'number' ? initialBgO : 100) / 100};
    --header-bg-scrolled: ${hslObjToCss(scrolledBgC, 'white')};
    --header-bg-scrolled-alpha: ${(typeof scrolledBgO === 'number' ? scrolledBgO : 100) / 100};
  }`;
  ensureStyleEl().textContent = (ensureStyleEl().textContent || '') + css;
}
