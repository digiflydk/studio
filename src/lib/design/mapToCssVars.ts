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
    logo: { maxWidth: 140, width: 140 },
    border: { enabled: false, width: 1, color: {h:220, s:13, l:91} },
    bg: {
      initial: { h:255, s:255, l:255, opacity: 1 },
      scrolled: { h:255, s:255, l:255, opacity: 1 },
    },
    navLinks: [],
    bgOpacity: 1,
    scrolledBg: '#FFFFFF',
    scrolledOpacity: 1,
  },
  footer: { bg: '#111827', textColor: '#D1D5DB', border: { enabled: false, width: 1, color: '#1F2937' } },
  hero: { offsetMode: 'auto', fixedOffset: 0, bg: '#F9FAFB' },
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
        footer: { ...d.footer!, ...safeSettings.footer,
          border: { ...d.footer!.border, ...safeSettings.footer?.border }
        },
        hero: { ...d.hero!, ...safeSettings.hero },
        buttonSettings: { ...d.buttonSettings!, ...safeSettings.buttonSettings },
    };

  const initialBg = S.header!.bg?.initial?.h ? hToHex(S.header!.bg.initial as any) : S.header!.bg || '#FFFFFF';
  const initialOpacity = S.header!.bg?.initial?.opacity ?? S.header!.bgOpacity ?? 1;

  const scrolledBgFromSettings = S.header!.bg?.scrolled?.h ? hToHex(S.header!.bg.scrolled as any) : S.header!.scrolledBg;
  const scrolledBg = scrolledBgFromSettings ?? initialBg;
  const scrolledOpacity = S.header!.bg?.scrolled?.opacity ?? S.header!.scrolledOpacity ?? 1;

  const btnPrimaryBg = S.buttonSettings!.colors.primary || S.brandPrimary;


  const vars: Record<string, string> = {
    '--brand-primary': S.brandPrimary!,
    '--brand-secondary': S.brandSecondary!,
    '--text-color': S.textColor!,
    '--link-color': S.linkColor!,
    '--font-family': S.fontFamily!,
    '--font-scale': String(S.fontScale),
    '--spacing-base': `${S.spacingBase}px`,

    /* Header core */
    '--header-height': `${S.header!.height}px`,
    '--header-bg': hexToRgba(initialBg, initialOpacity),
    '--header-bg-raw': initialBg,
    '--header-bg-opacity': String(initialOpacity),
    '--header-bg-scrolled': hexToRgba(scrolledBg, scrolledOpacity),
    '--header-bg-scrolled-raw': scrolledBg,
    '--header-bg-scrolled-opacity': String(scrolledOpacity),

    '--header-border-width': S.header!.border!.enabled ? `${S.header!.border!.width}px` : '0px',
    '--header-border-color': S.header!.border!.color ? hToHex(S.header!.border!.color) : 'transparent',
    '--logo-max-height': `${S.header!.logo!.maxHeight}px`,
    '--logo-width': `${S.header!.logo!.width}px`,

    /* Footer */
    '--footer-bg': S.footer!.bg!,
    '--footer-text': S.footer!.textColor!,
    '--footer-border-width': S.footer!.border!.enabled ? `${S.footer!.border!.width}px` : '0px',
    '--footer-border-color': S.footer!.border!.color!,

    /* Hero / Buttons */
    '--hero-offset-mode': S.hero!.offsetMode!,
    '--hero-fixed-offset': `${S.hero!.fixedOffset}px`,
    '--hero-bg': S.hero!.bg!,
    '--btn-shape': S.buttonSettings!.designType!,
    '--btn-radius': `${S.buttonSettings!.radius}px`,
    '--btn-text-size': S.buttonSettings!.defaultSize!,
    '--btn-primary-bg': btnPrimaryBg,
    '--btn-primary-text': S.buttonSettings!.colors.text!,
  };

  vars['--hero-top-offset'] =
    S.hero!.offsetMode === 'auto' ? `${S.header!.height}px` : `${S.hero!.fixedOffset}px`;
    
  // Floating CTA vars (defaults)
  vars['--cta-float-pos'] = S.header!.ctaFloating?.position ?? 'bottom-right';
  vars['--cta-float-offset-x'] = `${S.header!.ctaFloating?.offsetX ?? 16}px`;
  vars['--cta-float-offset-y'] = `${S.header!.ctaFloating?.offsetY ?? 16}px`;

  return vars;
}
