
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
import Analytics from '@/components/analytics';
import { ReactNode } from 'react';
import Script from 'next/script';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

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
      icon: '/favicon.ico',
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
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`
            try {
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
            } catch (e) {}
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Analytics settings={settings} />
      </head>
      <body className="font-body antialiased">
        <Header settings={settings} />
        <main className="flex-1">
            {children}
        </main>
        <Footer settings={settings}/>
        <Toaster />
      </body>
    </html>
  );
}
