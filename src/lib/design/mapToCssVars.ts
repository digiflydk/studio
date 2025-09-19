
// lib/design/mapToCssVars.ts
import type { HeaderSettings, ButtonSettings, HSLColor } from '@/types/settings';

type ThemeColors = {
    primary: HSLColor;
    background: HSLColor;
    accent: HSLColor;
};

// Hjælpere — antag at du allerede har en hToHex/hslaToCss funktion et andet sted.
// Hvis ikke, kan disse simple fallback-funktioner bruges:
function hslaToCss(h?: number, s?: number, l?: number, opacity?: number) {
  const _h = typeof h === 'number' ? h : 0;
  const _s = typeof s === 'number' ? s : 0;
  const _l = typeof l === 'number' ? l : 100;
  // Opacity er 0-100 i vores settings
  const _o = typeof opacity === 'number' ? opacity / 100 : 1;
  return `hsla(${_h} ${_s}% ${_l}% / ${_o})`;
}

export function mapToCssVars(
  header: Partial<HeaderSettings> | undefined,
  buttonSettings: Partial<ButtonSettings> | undefined,
  themeColors?: Partial<ThemeColors>
): Record<string, string> {
  const h = (header ?? {}) as any;
  const btn = (buttonSettings ?? {}) as any;
  const ctaFloat = (h?.cta?.mobileFloating ?? {}) as any;
  const border = (h?.border ?? {}) as any;
  const logo = (h?.logo ?? {}) as any;
  const bgInit = (h?.bg?.initial ?? {}) as any;
  const bgScroll = (h?.bg?.scrolled ?? {}) as any;
  const btnColors = (btn?.colors ?? {}) as any;

  const vars: Record<string, string> = {
    '--header-height': `${h?.headerHeight ?? h?.height ?? 72}px`,
    '--logo-max-width': `${logo?.maxWidth ?? 140}px`,

    '--header-border-width': border?.enabled ? `${border?.widthPx ?? 1}px` : '0px',
    '--header-border-color': border?.enabled
      ? (border?.colorHex ? `#${border.colorHex.replace('#', '')}` : hslaToCss(border?.color?.h, border?.color?.s, border?.color?.l, border?.color?.opacity))
      : 'transparent',

    '--cta-float-offset-x': `${ctaFloat?.offsetX ?? 16}px`,
    '--cta-float-offset-y': `${ctaFloat?.offsetY ?? 16}px`,
    
    '--header-bg': hslaToCss(bgInit?.h, bgInit?.s, bgInit?.l, bgInit?.opacity),
    '--header-bg-scrolled': hslaToCss(bgScroll?.h, bgScroll?.s, bgScroll?.l, bgScroll?.opacity),

    '--btn-primary-bg': btnColors?.primary ?? '#2563EB',
    '--btn-primary-text': btnColors?.text ?? '#FFFFFF',
    '--btn-color-hover': btnColors?.hover ?? btnColors?.primary ?? '#1D4ED8',
    '--btn-font-family': btn?.fontFamily ?? 'Inter, ui-sans-serif, system-ui',
    '--btn-font-weight': String(btn?.fontWeight ?? 600),
    '--btn-radius': (btn?.designType ?? 'default') === 'pill' ? '9999px' : '0.5rem',
  };

  // Theme fallback – hvis tilstede
  if (themeColors?.primary) {
    vars['--primary'] = `${themeColors.primary.h} ${themeColors.primary.s}% ${themeColors.primary.l}%`;
  }
  if (themeColors?.accent) {
    vars['--accent'] = `${themeColors.accent.h} ${themeColors.accent.s}% ${themeColors.accent.l}%`;
  }
  if (themeColors?.background) {
    vars['--background'] = `${themeColors.background.h} ${themeColors.background.s}% ${themeColors.background.l}%`;
  }

  return vars;
}
