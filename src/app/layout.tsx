
import type { Metadata, ResolvingMetadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
import { ReactNode } from 'react';
import Script from 'next/script';
import Analytics from '@/components/analytics';
import { ThemeContextWrapper } from '@/context/ThemeContextWrapper';

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  let settings = null;
  try {
    settings = await getGeneralSettings();
  } catch (error) {
    console.error("METADATA_FETCH_ERROR: Failed to fetch settings for metadata. This might be expected during build time.", error);
  }
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
  let settings = null;
  try {
      settings = await getGeneralSettings();
  } catch (error) {
      console.error("LAYOUT_FETCH_ERROR: Failed to fetch settings for layout. This might be expected during build time.", error);
  }
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ThemeContextWrapper settings={settings}>
            {children}
            <Analytics settings={settings} />
            <Toaster />
        </ThemeContextWrapper>
      </body>
    </html>
  );
}
