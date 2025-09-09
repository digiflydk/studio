
"use client";

import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import type { GeneralSettings } from '@/types/settings';

type HSLColor = { h: number; s: number; l: number };
type FontSizes = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  body: number;
};

export interface Theme {
  colors: {
    primary: HSLColor;
    background: HSLColor;
    accent: HSLColor;
  };
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeColor: (colorName: keyof Theme['colors'], hsl: HSLColor) => void;
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

export const ThemeProvider = ({ settings, children }: { settings: GeneralSettings | null, children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return {
        colors: settings?.themeColors || defaultTheme.colors,
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = document.documentElement;
    // Colors
    Object.entries(themeToApply.colors).forEach(([name, hsl]) => {
      root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
    setIsLoaded(true);
  }, [theme, applyTheme]);
  
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };
  
  const setThemeColor = (colorName: keyof Theme['colors'], hsl: HSLColor) => {
    const newTheme = { ...theme, colors: { ...theme.colors, [colorName]: hsl } };
    handleSetTheme(newTheme);
  };
  
  const setFontSize = (sizeName: keyof FontSizes, sizeInRem: number) => {
     // This function is now a no-op as font sizes are handled by Tailwind
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, setThemeColor, isLoaded }}>
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
