
import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getGeneralSettings } from '@/services/settings';
import { ThemeProvider } from '@/context/ThemeContext';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();
  const headerHeight = settings?.headerHeight || 64;

  return (
    <ThemeProvider settings={settings}>
      <Header settings={settings} />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </ThemeProvider>
  );
}
