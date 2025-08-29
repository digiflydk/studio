
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/context/ThemeContext';
import { getGeneralSettings } from '@/services/settings';
import Analytics from '@/components/analytics';
import { Suspense } from 'react';
import Script from 'next/script';
import ScrollManager from '@/components/scroll-manager';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const previousImages = (await parent).openGraph?.images || [];

  const icons = settings?.faviconUrl ? [{ rel: 'icon', url: settings.faviconUrl }] : [];

  const defaultTitle = 'Digifly – Konsulentydelser i AI, automatisering og digital skalering';
  const defaultDescription = 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger. Book et møde i dag.';
  
  const title = settings?.seoTitle || defaultTitle;
  const description = settings?.metaDescription || defaultDescription;
  const openGraphImages = settings?.socialShareImageUrl ? [settings.socialShareImageUrl] : [];


  const metadata: Metadata = {
    title: title,
    description: description,
    icons,
    openGraph: {
      title: title,
      description: description,
      images: [...openGraphImages, ...previousImages],
      type: 'website',
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGeneralSettings();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script id="datalayer-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent mode
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Suspense fallback={null}>
            <Analytics />
        </Suspense>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider settings={settings}>
          <ScrollManager />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
