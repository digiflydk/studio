// lib/design/mapToCssVars.ts
import type { GeneralSettings } from '@/types/settings';

function hexToRgba(hex: string, opacity: number) {
  if(!hex) return `rgba(255,255,255,${opacity})`;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  const r = m ? parseInt(m[1], 16) : 0;
  const g = m ? parseInt(m[2], 16) : 0;
  const b = m ? parseInt(m[3], 16) : 0;
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(${r}, ${g}, ${b}, ${o})`;
}

const d: GeneralSettings = {
  themeColors: {
    primary: {h: 211, s: 100, l: 50 },
    background: {h: 210, s: 100, l: 95 },
    accent: {h: 211, s: 100, l: 40 },
  },
  header: {
    height: 80,
    logo: { maxWidth: 140 },
    border: { enabled: false, width: 1, color: {h:220, s:13, l:91} },
    bg: {
      initial: { h:255, s:255, l:255, opacity: 1 },
      scrolled: { h:255, s:255, l:255, opacity: 1 },
    },
    navLinks: [],
  },
  hero: { offsetMode: 'auto', fixedOffset: 0 },
  buttonSettings: {
    designType: 'default',
    fontFamily: 'Inter',
    fontWeight: 600,
    colors: { primary: '#2563EB', secondary: '#1F2937', hover: '#1D4ED8' },
    defaultVariant: 'primary',
    defaultSize: 'md',
  }
};

function hToHex(h: {h:number,s:number,l:number}){
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
    const safeSettings = s || {};
    const S: GeneralSettings = {
        ...d,
        ...safeSettings,
        themeColors: { ...d.themeColors!, ...safeSettings.themeColors },
        header: { ...d.header!, ...safeSettings.header,
            logo: { ...d.header!.logo, ...safeSettings.header?.logo },
            border: { ...d.header!.border, ...safeSettings.header?.border },
            bg: { ...d.header!.bg, ...safeSettings.header?.bg,
                initial: { ...d.header!.bg.initial, ...safeSettings.header?.bg?.initial },
                scrolled: { ...d.header!.bg.scrolled, ...safeSettings.header?.bg?.scrolled },
            },
        },
        hero: { ...d.hero!, ...safeSettings.hero },
        buttonSettings: { ...d.buttonSettings!, ...safeSettings.buttonSettings },
    };

  const initialBg = S.header!.bg.initial.h ? hToHex(S.header!.bg.initial as any) : '#FFFFFF';
  const initialOpacity = S.header!.bg.initial.opacity ?? 1;
  const scrolledBg = S.header!.bg.scrolled.h ? hToHex(S.header!.bg.scrolled as any) : initialBg;
  const scrolledOpacity = S.header!.bg.scrolled.opacity ?? 1;

  const vars: Record<string, string> = {
    /* Header core */
    '--header-height': `${S.header!.height}px`,
    '--header-bg': hexToRgba(initialBg, initialOpacity),
    '--header-bg-scrolled': hexToRgba(scrolledBg, scrolledOpacity),
    '--header-border-width': S.header!.border.enabled ? `${S.header!.border.width}px` : '0px',
    '--header-border-color': S.header!.border.color ? hToHex(S.header!.border.color) : 'transparent',
    '--logo-max-width': `${S.header!.logo.maxWidth}px`,

    /* Hero */
    '--hero-offset-mode': S.hero!.offsetMode,
    '--hero-fixed-offset': `${S.hero!.fixedOffset}px`,
  };

  vars['--hero-top-offset'] =
    S.hero!.offsetMode === 'auto' ? `${S.header!.height}px` : `${S.hero!.fixedOffset}px`;

  return vars;
}
