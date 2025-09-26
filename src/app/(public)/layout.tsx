
import { ReactNode } from 'react';
import HeaderClient from '@/components/layout/HeaderClient';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';
import { getWebsiteHeaderConfig } from '@/services/website.server';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [settings, headerConfig] = await Promise.all([
    getGeneralSettings(),
    getWebsiteHeaderConfig(),
  ]);

  return (
    <ThemeProvider settings={settings}>
      <HeaderClient config={headerConfig} />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </ThemeProvider>
  );
}
