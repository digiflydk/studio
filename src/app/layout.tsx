
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
import { ReactNode } from 'react';
import Script from 'next/script';
import Analytics from '@/components/analytics';
import { ThemeProvider } from '@/context/ThemeContext';

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const previousImages = (await parent).openGraph?.images || [];

  const defaultTitle = 'Digifly – Konsulentydelser i AI, automatisering og digital skalering';
  const defaultDescription = 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger. Book et møde i dag.';
  
  const title = settings?.seoTitle || defaultTitle;
  const description = settings?.metaDescription || defaultDescription;
  const openGraphImages = settings?.socialShareImageUrl ? [settings.socialShareImageUrl] : [];


  const metadata: Metadata = {
    metadataBase: process.env.VERCEL_URL ? new URL(`https://${process.env.VERCEL_URL}`) : new URL('http://localhost:9002'),
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [...openGraphImages, ...previousImages],
      type: 'website',
    },
    robots: {},
    icons: {
      icon: settings?.faviconUrl || '/favicon.ico',
    },
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
  children: ReactNode;
}>) {
  const settings = await getGeneralSettings();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Analytics settings={settings} />
        <Toaster />
      </body>
    </html>
  );
}
