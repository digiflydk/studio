
"use client";

import { ThemeProvider as BaseThemeProvider } from './ThemeContext';
import type { GeneralSettings } from '@/services/settings';

export function CmsThemeProvider({ settings, children }: { settings: GeneralSettings | null, children: React.ReactNode }) {
    return (
        <BaseThemeProvider settings={settings}>
            {children}
        </BaseThemeProvider>
    )
}
