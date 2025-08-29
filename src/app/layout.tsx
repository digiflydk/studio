
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { getGeneralSettings } from '@/services/settings';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const previousImages = (await parent).openGraph?.images || [];

  const icons = settings?.faviconUrl ? [{ rel: 'icon', url: settings.faviconUrl }] : [];

  const defaultTitle = 'Digifly – Konsulentydelser i AI, automatisering og digital skalering';
  const defaultDescription = 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger. Book et møde i dag.';

  const metadata: Metadata = {
    title: settings?.seoTitle || defaultTitle,
    description: settings?.metaDescription || defaultDescription,
    icons,
    openGraph: {
      title: settings?.seoTitle || defaultTitle,
      description: settings?.metaDescription || defaultDescription,
      images: [...previousImages],
    },
    robots: {},
  };

  if (settings?.allowSearchEngineIndexing === false) {
    metadata.robots!.index = false;
    metadata.robots!.follow = false;
  } else {
    metadata.robots!.index = true;
    metadata.robots!.follow = true;
  }

  return metadata;
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
