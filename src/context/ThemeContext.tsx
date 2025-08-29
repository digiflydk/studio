"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type HSLColor = { h: number; s: number; l: number };
type FontSizes = {
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  body: number;
};

interface Theme {
  colors: {
    primary: HSLColor;
    background: HSLColor;
    accent: HSLColor;
  };
  fontSizes: FontSizes;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeColor: (colorName: keyof Theme['colors'], hsl: HSLColor) => void;
  setFontSize: (sizeName: keyof FontSizes, size: number) => void;
  resetTheme: () => void;
}

const defaultTheme: Theme = {
  colors: {
    primary: { h: 211, s: 100, l: 50 },
    background: { h: 210, s: 100, l: 95 },
    accent: { h: 211, s: 100, l: 40 },
  },
  fontSizes: {
    h1: 4,
    h2: 2.25,
    h3: 1.875,
    h4: 1.5,
    body: 1.125,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, _setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('digifly-theme');
      if (storedTheme) {
        _setTheme(JSON.parse(storedTheme));
      }
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error)
    }
  }, []);

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = document.documentElement;
    // Colors
    Object.entries(themeToApply.colors).forEach(([name, hsl]) => {
      root.style.setProperty(`--${name}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    });
    // Font Sizes
    Object.entries(themeToApply.fontSizes).forEach(([name, size]) => {
      root.style.setProperty(`--font-size-${name}`, `${size}rem`);
    });
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('digifly-theme', JSON.stringify(newTheme));
      _setTheme(newTheme);
    } catch (error) {
       console.error("Failed to save theme to localStorage", error)
    }
  };
  
  const setThemeColor = (colorName: keyof Theme['colors'], hsl: HSLColor) => {
    const newTheme = { ...theme, colors: { ...theme.colors, [colorName]: hsl } };
    setTheme(newTheme);
  };
  
  const setFontSize = (sizeName: keyof FontSizes, size: number) => {
     const newTheme = { ...theme, fontSizes: { ...theme.fontSizes, [sizeName]: size } };
     setTheme(newTheme);
  };

  const resetTheme = () => {
    localStorage.removeItem('digifly-theme');
    _setTheme(defaultTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setThemeColor, setFontSize, resetTheme }}>
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
