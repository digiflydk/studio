'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Sidebar from '@/components/cms/Sidebar';
import CmsHeader from '@/components/cms/CmsHeader';

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider settings={null}>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col bg-white">
            <CmsHeader settings={null} />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
