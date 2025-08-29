
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
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
        <Script id="scroll-restoration" strategy="beforeInteractive">
          {`
            console.log('AUTOSCROLL KILLER: Script loaded. Setting history.scrollRestoration to manual.');
            try {
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
            } catch (e) {
              console.error('AUTOSCROLL KILLER: Error setting scrollRestoration:', e);
            }
          `}
        </Script>
        <Script id="scroll-debug" strategy="afterInteractive">
          {`
            const killScroll = () => {
                console.log('AUTOSCROLL KILLER: Forcing scroll to top at ' + new Date().toLocaleTimeString());
                window.scrollTo(0, 0);
            };
            
            // Re-kill on popstate (browser back/forward)
            window.addEventListener('popstate', () => {
              console.log('AUTOSCROLL KILLER: Popstate event detected.');
              killScroll();
            });
            
            // Re-kill after a short delay to fight any late-loading scripts
            setTimeout(() => {
              console.log('AUTOSCROLL KILLER: Initial timeout (100ms) fired.');
              killScroll();
            }, 100);
            setTimeout(() => {
              console.log('AUTOSCROLL KILLER: Second timeout (500ms) fired.');
              killScroll();
            }, 500);
             setTimeout(() => {
              console.log('AUTOSCROLL KILLER: Third timeout (1000ms) fired.');
              killScroll();
            }, 1000);
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
