
'use client';

import { ReactNode, Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { useGeneralSettings } from "@/hooks/use-general-settings";

export default function CmsTemplate({ children }: { children: ReactNode }) {
    const settings = useGeneralSettings();
    
    return (
        <Suspense fallback={<>{children}</>}>
            <ThemeProvider settings={settings}>
                {children}
            </ThemeProvider>
        </Suspense>
    );
}
