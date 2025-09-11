// lib/design/mapToCssVars.ts
import type { SettingsGeneral } from '@/lib/firestore/settings';

const d = {
  brandPrimary: '#6B46C1',
  brandSecondary: '#111827',
  textColor: '#111827',
  linkColor: '#2563EB',
  fontFamily: 'system-ui',
  fontScale: 1.0,
  spacingBase: 8,
  header: { height: 80, bg: '#FFFFFF', sticky: true, logo: { maxHeight: 32, aspect:'contain' as const },
            border: { enabled:false, width:1, color:'#E5E7EB' } },
  footer: { bg:'#111827', textColor:'#D1D5DB',
            border: { enabled:false, width:1, color:'#1F2937' } },
  hero: { offsetMode:'auto' as const, fixedOffset:0, bg:'#F9FAFB' },
  button: { design:'default' as const, radius:8, textSize:'md' as const,
            primary:{ bg: undefined as string|undefined, text:'#FFFFFF' } },
};

export function mapToCssVars(s: Partial<SettingsGeneral> = {}) {
  const S = structuredClone(d);
  // shallow merge (nok til vores brug)
  Object.assign(S, s);
  if (s.header) Object.assign(S.header, s.header);
  if (s.header?.border) Object.assign(S.header.border, s.header.border);
  if (s.header?.logo) Object.assign(S.header.logo, s.header.logo);
  if (s.footer) Object.assign(S.footer, s.footer);
  if (s.footer?.border) Object.assign(S.footer.border, s.footer.border);
  if (s.hero) Object.assign(S.hero, s.hero);
  if (s.button) Object.assign(S.button, s.button);
  if (s.button?.primary) Object.assign(S.button.primary, s.button.primary);

  const btnPrimaryBg = S.button.primary.bg || S.brandPrimary;

  const vars: Record<string,string> = {
    '--brand-primary': S.brandPrimary,
    '--brand-secondary': S.brandSecondary,
    '--text-color': S.textColor,
    '--link-color': S.linkColor,
    '--font-family': S.fontFamily,
    '--font-scale': String(S.fontScale),
    '--spacing-base': `${S.spacingBase}px`,
    '--header-height': `${S.header.height}px`,
    '--header-bg': S.header.bg,
    '--header-border-width': S.header.border.enabled ? `${S.header.border.width}px` : '0px',
    '--header-border-color': S.header.border.color,
    '--logo-max-height': `${S.header.logo.maxHeight}px`,
    '--footer-bg': S.footer.bg,
    '--footer-text': S.footer.textColor,
    '--footer-border-width': S.footer.border.enabled ? `${S.footer.border.width}px` : '0px',
    '--footer-border-color': S.footer.border.color,
    '--hero-offset-mode': S.hero.offsetMode,
    '--hero-fixed-offset': `${S.hero.fixedOffset}px`,
    '--hero-bg': S.hero.bg,
    '--btn-shape': S.button.design,
    '--btn-radius': `${S.button.radius}px`,
    '--btn-text-size': S.button.textSize,
    '--btn-primary-bg': btnPrimaryBg,
    '--btn-primary-text': S.button.primary.text,
  };

  // Derived
  vars['--hero-top-offset'] = (S.hero.offsetMode === 'auto')
    ? `${S.header.height}px`
    : `${S.hero.fixedOffset}px`;

  return vars;
}
