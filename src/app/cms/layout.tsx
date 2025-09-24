
'use client';

import CmsHeader from "@/components/cms/CmsHeader";
import Sidebar from "@/components/cms/Sidebar";
import { getGeneralSettings }from "@/services/settings";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider settings={null}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col bg-white">
          <Suspense fallback={<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"><Loader2 className="h-5 w-5 animate-spin" /></header>}>
            <CmsHeader settings={null} />
          </Suspense>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
