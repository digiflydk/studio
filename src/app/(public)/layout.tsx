import { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import { getAdminHeader } from '@/services/admin.server';


export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, header] = await Promise.all([
    getGeneralSettings(),
    getAdminHeader(),
  ]);

  return (
    <ThemeProvider settings={settings}>
        {header ? (
          <SiteHeader />
        ) : (
          <div className="h-16" /> // enkel placeholder så siden ikke er tom
        )}
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
