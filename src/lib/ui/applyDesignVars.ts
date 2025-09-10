
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

export function applyDesignVars(general: AnyGeneral | null | undefined) {
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

  const css = `:root{
    --btn-color-primary: ${primary};
    --btn-color-hover: ${hover};
    --btn-shape: ${radius};
    --btn-font: ${fontFamily};
    --btn-font-weight: ${fontWeight};
  }`;

  ensureStyleEl().textContent = css;
}
