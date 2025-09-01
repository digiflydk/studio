
import { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getGeneralSettings } from '@/services/settings';

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getGeneralSettings();

  return (
      <>
        <Header settings={settings} />
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
            {children}
            </main>
            <Footer settings={settings} />
        </div>
      </>
  );
}
