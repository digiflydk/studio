
'use client';

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { useGeneralSettings } from "@/hooks/use-general-settings";

export default function CmsTemplate({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    
    return (
        <ThemeProvider settings={settings}>
            {children}
        </ThemeProvider>
    );
}
