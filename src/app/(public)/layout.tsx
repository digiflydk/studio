
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
      <div className="flex flex-col min-h-screen">
        <Header settings={settings} />
        <main className="flex-1" style={{ paddingTop: `${headerHeight}px` }}>
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </ThemeProvider>
  );
}
