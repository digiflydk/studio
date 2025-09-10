
import { GeneralSettings, ButtonSettings, TypographySettings } from "@/types/settings";

function applyTypography(t: TypographySettings | undefined) {
    if (!t) return;
    const r = document.documentElement.style;
    
    r.setProperty('--font-primary', t.fontPrimary || 'Inter, ui-sans-serif, system-ui');
    if (t.fontSecondary) r.setProperty('--font-secondary', t.fontSecondary);
    else r.setProperty('--font-secondary', t.fontPrimary || 'Inter, ui-sans-serif, system-ui');

    r.setProperty('--h1-size-mobile', String(t.h1.sizeMobile));
    r.setProperty('--h1-size-desktop', String(t.h1.sizeDesktop));
    r.setProperty('--h1-weight', String(t.h1.weight));
    r.setProperty('--h1-lh', String(t.h1.lineHeight));
    
    r.setProperty('--h2-size-mobile', String(t.h2.sizeMobile));
    r.setProperty('--h2-size-desktop', String(t.h2.sizeDesktop));
    r.setProperty('--h2-weight', String(t.h2.weight));
    r.setProperty('--h2-lh', String(t.h2.lineHeight));

    r.setProperty('--h3-size-mobile', String(t.h3.sizeMobile));
    r.setProperty('--h3-size-desktop', String(t.h3.sizeDesktop));
    r.setProperty('--h3-weight', String(t.h3.weight));
    r.setProperty('--h3-lh', String(t.h3.lineHeight));
    
    r.setProperty('--h4-size-mobile', String(t.h4.sizeMobile));
    r.setProperty('--h4-size-desktop', String(t.h4.sizeDesktop));
    r.setProperty('--h4-weight', String(t.h4.weight));
    r.setProperty('--h4-lh', String(t.h4.lineHeight));
    
    r.setProperty('--body-size', String(t.body.size));
    r.setProperty('--body-weight', String(t.body.weight));
    r.setProperty('--body-lh', String(t.body.lineHeight));
}

function applyButtons(b: ButtonSettings | undefined) {
    if (!b) return;
    const r = document.documentElement.style;
    
    r.setProperty('--btn-radius', b.designType === 'pill' ? '9999px' : '0.5rem');
    
    const family = b.fontFamily === 'Manrope' ? 'Manrope, ui-sans-serif, system-ui' :
                   b.fontFamily === 'System'  ? 'ui-sans-serif, system-ui' :
                                                'Inter, ui-sans-serif, system-ui';
    r.setProperty('--btn-font-family', family);
    r.setProperty('--btn-font-weight', String(b.fontWeight || 600));

    if (b.colors?.primary)   r.setProperty('--btn-color-primary', b.colors.primary);
    if (b.colors?.secondary) r.setProperty('--btn-color-secondary', b.colors.secondary);
    if (b.colors?.hover)     r.setProperty('--btn-color-hover', b.colors.hover);
}

export function applyDesignVars(settings: GeneralSettings | null) {
  if (!settings) return;
  const root = document.documentElement;

  // Colors
  if (settings.themeColors) {
    Object.entries(settings.themeColors).forEach(([name, hsl]) => {
      root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    });
  }

  // Typography
  applyTypography(settings.typography);
  
  // Buttons
  applyButtons(settings.buttonSettings);
}

// For server-side rendering
export function makeVarsCss(settings: GeneralSettings | null): string {
  if (!settings) return '';

  const parts: string[] = [];
  
  // Colors
  if (settings.themeColors) {
    for (const [name, hsl] of Object.entries(settings.themeColors)) {
        parts.push(`--${name}: ${hsl.h} ${hsl.s}% ${hsl.l}%;`);
    }
  }

  // Typography
  const t = settings.typography;
  if (t) {
    parts.push(`--font-primary: ${t.fontPrimary || 'Inter, ui-sans-serif, system-ui'};`);
    parts.push(`--font-secondary: ${t.fontSecondary || t.fontPrimary || 'Inter, ui-sans-serif, system-ui'};`);
    parts.push(`--h1-size-mobile: ${t.h1.sizeMobile};`);
    parts.push(`--h1-size-desktop: ${t.h1.sizeDesktop};`);
    parts.push(`--h1-weight: ${t.h1.weight};`);
    parts.push(`--h1-lh: ${t.h1.lineHeight};`);
    parts.push(`--h2-size-mobile: ${t.h2.sizeMobile};`);
    parts.push(`--h2-size-desktop: ${t.h2.sizeDesktop};`);
    parts.push(`--h2-weight: ${t.h2.weight};`);
    parts.push(`--h2-lh: ${t.h2.lineHeight};`);
    parts.push(`--h3-size-mobile: ${t.h3.sizeMobile};`);
    parts.push(`--h3-size-desktop: ${t.h3.sizeDesktop};`);
    parts.push(`--h3-weight: ${t.h3.weight};`);
    parts.push(`--h3-lh: ${t.h3.lineHeight};`);
    parts.push(`--h4-size-mobile: ${t.h4.sizeMobile};`);
    parts.push(`--h4-size-desktop: ${t.h4.sizeDesktop};`);
    parts.push(`--h4-weight: ${t.h4.weight};`);
    parts.push(`--h4-lh: ${t.h4.lineHeight};`);
    parts.push(`--body-size: ${t.body.size};`);
    parts.push(`--body-weight: ${t.body.weight};`);
    parts.push(`--body-lh: ${t.body.lineHeight};`);
  }

  // Buttons
  const b = settings.buttonSettings;
  if (b) {
    const radius = b.designType === 'pill' ? '9999px' : '0.5rem';
    const family = b.fontFamily === 'Manrope' ? 'Manrope, ui-sans-serif, system-ui' :
                   b.fontFamily === 'System'  ? 'ui-sans-serif, system-ui' :
                                                'Inter, ui-sans-serif, system-ui';
    parts.push(`--btn-radius: ${radius};`);
    parts.push(`--btn-font-family: ${family};`);
    parts.push(`--btn-font-weight: ${b.fontWeight || 600};`);
    if(b.colors?.primary) parts.push(`--btn-color-primary: ${b.colors.primary};`);
    if(b.colors?.secondary) parts.push(`--btn-color-secondary: ${b.colors.secondary};`);
    if(b.colors?.hover) parts.push(`--btn-color-hover: ${b.colors.hover};`);
  }

  return `:root { ${parts.join(' ')} }`;
}
