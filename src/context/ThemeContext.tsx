
"use client";

import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import type { GeneralSettings, TypographySettings } from '@/types/settings';

type HSLColor = { h: number; s: number; l: number };

export interface Theme {
  colors: {
    primary: HSLColor;
    background: HSLColor;
    accent: HSLColor;
  };
}

const defaultTypography: TypographySettings = {
    fontPrimary: "Inter",
    fontSecondary: "",
    h1: { sizeMobile: 32, sizeDesktop: 48, weight: 700, lineHeight: 1.2 },
    h2: { sizeMobile: 26, sizeDesktop: 36, weight: 700, lineHeight: 1.25 },
    h3: { sizeMobile: 22, sizeDesktop: 28, weight: 700, lineHeight: 1.3 },
    h4: { sizeMobile: 18, sizeDesktop: 22, weight: 700, lineHeight: 1.35 },
    body: { size: 16, weight: 400, lineHeight: 1.6 },
};

interface ThemeContextType {
  theme: Theme;
  typography: TypographySettings;
  setTheme: (theme: Theme) => void;
  setThemeColor: (colorName: keyof Theme['colors'], hsl: HSLColor) => void;
  setTypography: (typography: TypographySettings) => void;
  isLoaded: boolean;
}

export const defaultTheme: Theme = {
  colors: {
    primary: { h: 211, s: 100, l: 50 },
    background: { h: 210, s: 100, l: 95 },
    accent: { h: 211, s: 100, l: 40 },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyTypographyVars(t: TypographySettings) {
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


export const ThemeProvider = ({ settings, children }: { settings: GeneralSettings | null, children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => ({
    colors: settings?.themeColors || defaultTheme.colors,
  }));
  const [typography, setTypographyState] = useState<TypographySettings>(() => (
    settings?.typography || defaultTypography
  ));
  const [isLoaded, setIsLoaded] = useState(false);

  const applyTheme = useCallback((themeToApply: Theme, typographyToApply: TypographySettings) => {
    const root = document.documentElement;
    // Colors
    Object.entries(themeToApply.colors).forEach(([name, hsl]) => {
      root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    });
    // Typography
    applyTypographyVars(typographyToApply);
  }, []);

  useEffect(() => {
    applyTheme(theme, typography);
    setIsLoaded(true);
  }, [theme, typography, applyTheme]);
  
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };
  
  const handleSetTypography = (newTypography: TypographySettings) => {
    setTypographyState(newTypography);
  }
  
  const setThemeColor = (colorName: keyof Theme['colors'], hsl: HSLColor) => {
    const newTheme = { ...theme, colors: { ...theme.colors, [colorName]: hsl } };
    handleSetTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, setThemeColor, typography, setTypography: handleSetTypography, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
