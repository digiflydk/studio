
// lib/design/mapToCssVars.ts
import type { GeneralSettings, HSLColor, ButtonSettings } from '@/types/settings';

function hexToRgba(hex: string, opacity: number) {
  if(!hex || !/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex.trim())) {
    return `rgba(255,255,255,${opacity})`;
  }
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())!;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${o})`;
}


function hToHex(h?: Partial<HSLColor>){
    if (!h || typeof h.h !== 'number' || typeof h.s !== 'number' || typeof h.l !== 'number') return '#FFFFFF';
    const {h:hue,s,l} = h;
    const lFix = l/100;
    const a = s * Math.min(lFix, 1 - lFix) / 100;
    const f = (n:number) => {
        const k = (n + hue / 30) % 12;
        const color = lFix - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function mapToCssVars(s: Partial<GeneralSettings> | null = {}) {
    const settings = s || {};
    const header = settings.header || {};
    const logo = header.logo || {};
    const border = header.border || {};
    const bg = header.bg || {};
    const initialBg = bg.initial || {};
    const scrolledBg = bg.scrolled || {};
    const ctaFloating = header.cta?.mobileFloating || {};
    const buttonSettings = settings.buttonSettings || {};
    const buttonColors = buttonSettings.colors || {};

    const initialBgHex = hToHex(initialBg as HSLColor);
    const scrolledBgHex = hToHex(scrolledBg as HSLColor);

    const vars: Record<string, string> = {
      // Header
      '--header-height': `${header.height || 72}px`,
      '--header-bg': hexToRgba(initialBgHex, initialBg.opacity ?? 1),
      '--header-bg-scrolled': hexToRgba(scrolledBgHex, scrolledBg.opacity ?? 1),
      '--header-border-width': border.enabled ? `${border.width || 1}px` : '0px',
      '--header-border-color': border.enabled ? hToHex(border.color) : 'transparent',
      
      // Logo
      '--logo-max-width': `${logo.maxWidth || 140}px`,
      
      // CTA
      '--cta-float-offset-x': `${ctaFloating.offsetX ?? 16}px`,
      '--cta-float-offset-y': `${ctaFloating.offsetY ?? 16}px`,

      // Buttons
      '--btn-radius': buttonSettings.designType === 'pill' ? '9999px' : '0.5rem',
      '--btn-font-family': buttonSettings.fontFamily || 'Inter, ui-sans-serif, system-ui',
      '--btn-font-weight': String(buttonSettings.fontWeight || 600),
      '--btn-primary-bg': buttonColors.primary || '#2563EB',
      '--btn-primary-text': buttonColors.text || '#FFFFFF',
      '--btn-color-hover': buttonColors.hover || buttonColors.primary || '#1D4ED8',
    };
    
    return vars;
}
