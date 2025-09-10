
'use client';
import { ThemeProvider } from './ThemeContext';
import type { GeneralSettings } from '@/types/settings';
import { useGeneralSettings } from '@/hooks/use-general-settings';

export function ThemeContextWrapper({ children }: { children: React.ReactNode }) {
    const settings = useGeneralSettings();

    return (
        <ThemeProvider settings={settings}>
            {children}
        </ThemeProvider>
    );
}

    