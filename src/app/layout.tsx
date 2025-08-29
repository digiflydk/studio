import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { getGeneralSettings } from '@/services/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();

  const icons = settings?.faviconUrl ? [{ rel: 'icon', url: settings.faviconUrl }] : [];

  return {
    title: settings?.websiteTitle || 'Digifly',
    description: 'Flow. Automatisér. Skalér. Vi hjælper virksomheder med at bygge skalerbare digitale løsninger.',
    icons,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
