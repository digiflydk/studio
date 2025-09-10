
'use client';

import { ReactNode } from "react";

export default function CmsTemplate({ children }: { children: ReactNode }) {
    // This component no longer needs ThemeProvider as the CMS
    // should have a separate, consistent theme.
    return <>{children}</>;
}
