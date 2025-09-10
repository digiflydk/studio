
import { GeneralSettings, ButtonSettings, TypographySettings } from "@/types/settings";

function makeButtonCss(settings: GeneralSettings | null): string[] {
    const parts: string[] = [];
    const btn = settings?.buttonSettings ?? settings?.buttons ?? {};
    
    const primary = btn?.colors?.primary ?? '#2563EB';
    const hover = btn?.colors?.hover ?? primary;
    
    // Radius/shape: “designType” (ny) eller “shape” (legacy)
    const designType = btn?.designType ?? btn?.shape;
    const radius = designType === 'pill' ? '9999px' : '8px';

    const fontFamily = btn?.fontFamily ?? 'inherit';
    const fontWeight = btn?.fontWeight ?? 600;

    parts.push(`--btn-color-primary: ${primary};`);
    parts.push(`--btn-color-hover: ${hover};`);
    parts.push(`--btn-shape: ${radius};`);
    parts.push(`--btn-font: ${fontFamily};`);
    parts.push(`--btn-font-weight: ${fontWeight};`);

    return parts;
}


// For server-side rendering
export function makeVarsCss(settings: GeneralSettings | null): string {
  if (!settings) return '';

  let parts: string[] = [];
  
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
  parts = [...parts, ...makeButtonCss(settings)];

  return `:root { ${parts.join(' ')} }`;
}
