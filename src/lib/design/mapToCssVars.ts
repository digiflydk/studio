
// lib/design/mapToCssVars.ts
import type { GeneralSettings, HSLColor, ButtonSettings, HeaderSettings } from '@/types/settings';

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

type Hsla = { h: number; s: number; l: number; opacity?: number };
type HeaderDefaults = Partial<HeaderSettings>;

export function mapToCssVars(settings: Partial<GeneralSettings> = {}) {
  const header: HeaderDefaults = settings.header ?? {};
  const buttonSettings: Partial<ButtonSettings> = settings.buttonSettings ?? {};

  const logo = header.logo ?? {};
  const border = header.border ?? {};
  const bg = header.bg ?? {};
  const initialBg = bg.initial || {};
  const scrolledBg = bg.scrolled || {};
  const ctaFloating = header.cta?.mobileFloating ?? {};
  const buttonColors = buttonSettings.colors ?? {};

  const initialBgHex = hToHex(initialBg as HSLColor);
  const scrolledBgHex = hToHex(scrolledBg as HSLColor);

  return {
    "--header-height": `${header.height ?? 72}px`,
    '--logo-max-width': `${logo.maxWidth || 140}px`,
    "--header-border-width": (border.enabled ? `${border.width || 1}px` : '0px'),
    "--header-border-color": border.enabled ? hToHex(border.color) : 'transparent',
    "--header-bg": `hsla(${(initialBg as Hsla).h ?? 0} ${(initialBg as Hsla).s ?? 0}% ${(initialBg as Hsla).l ?? 100}% / ${(initialBg as Hsla).opacity ?? 1})`,
    "--header-bg-scrolled": `hsla(${(scrolledBg as Hsla).h ?? 0} ${(scrolledBg as Hsla).s ?? 0}% ${(scrolledBg as Hsla).l ?? 100}% / ${(scrolledBg as Hsla).opacity ?? 1})`,

    '--cta-float-offset-x': `${ctaFloating.offsetX ?? 16}px`,
    '--cta-float-offset-y': `${ctaFloating.offsetY ?? 16}px`,

    '--btn-radius': buttonSettings.designType === 'pill' ? '9999px' : '0.5rem',
    '--btn-font-family': buttonSettings.fontFamily || 'Inter, ui-sans-serif, system-ui',
    '--btn-font-weight': String(buttonSettings.fontWeight || 600),
    '--btn-primary-bg': buttonColors.primary || '#2563EB',
    '--btn-primary-text': buttonColors.text || '#FFFFFF',
    '--btn-color-hover': buttonColors.hover || buttonColors.primary || '#1D4ED8',
  } as Record<string, string>;
}
