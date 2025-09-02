
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
import { ReactNode } from 'react';
import Analytics from '@/components/analytics';
import { ThemeContextWrapper } from '@/context/ThemeContextWrapper';

const inter = Inter({ subsets: ['latin'] })

// Replaced generateMetadata with a static export for build stability.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
  title: {
    default: 'Digifly – Konsulentydelser i AI, automatisering og digital skalering',
    template: '%s | Digifly'
  },
  description: 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger. Book et møde i dag.',
  openGraph: {
    title: 'Digifly – Konsulentydelser i AI, automatisering og digital skalering',
    description: 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger.',
    type: 'website',
    images: [], // Should be populated from CMS settings if possible, but static for now
  },
  robots: {
    index: true,
    follow: true,
    googleBot: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  },
  icons: {
    icon: '/favicon.ico', // Default fallback
  },
};


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
