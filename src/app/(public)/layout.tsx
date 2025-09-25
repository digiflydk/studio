import { ReactNode } from 'react';
import { getWebsiteHeaderConfig } from '@/services/website.server';
import HeaderClient from '@/components/layout/HeaderClient';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, header] = await Promise.all([getGeneralSettings(), getWebsiteHeaderConfig()]);

  return (
    <ThemeProvider settings={settings}>
      <HeaderClient config={header} />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
