
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
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
