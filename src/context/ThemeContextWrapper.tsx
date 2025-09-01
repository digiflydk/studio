
'use client';
import { ThemeProvider } from './ThemeContext';
import type { GeneralSettings } from '@/types/settings';

export function ThemeContextWrapper({ settings, children }: { settings: GeneralSettings | null, children: React.ReactNode }) {
    if (!settings) {
        // Return children directly or a loading state if settings are essential for the theme
        return <>{children}</>;
    }
    return (
        <ThemeProvider settings={settings}>
            {children}
        </ThemeProvider>
    );
}
