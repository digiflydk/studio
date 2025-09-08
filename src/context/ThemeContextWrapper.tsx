
'use client';
import { ThemeProvider } from './ThemeContext';
import type { GeneralSettings } from '@/types/settings';

export function ThemeContextWrapper({ settings, children }: { settings: GeneralSettings | null, children: React.ReactNode }) {
    // This wrapper is now simplified, but kept for structural consistency if needed later.
    // The ThemeProvider is now directly in the layouts that need it.
    return <>{children}</>;
}
