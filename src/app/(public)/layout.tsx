import { ReactNode } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import { getAdminHeader } from '@/services/admin.server';


export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, headerData] = await Promise.all([
    getGeneralSettings(),
    getAdminHeader(),
  ]);

  return (
    <ThemeProvider settings={settings}>
      <SiteHeader />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
