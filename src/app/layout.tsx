
import type { Metadata } from 'next';
import './globals.css';
import { getGeneralSettings } from '@/services/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const allowIndex = settings?.allowSearchEngineIndexing !== false;

  return {
    title: {
      default: settings?.seoTitle || 'Digifly – Konsulentydelser i AI, automatisering og digital skalering',
      template: `%s | ${settings?.websiteTitle || 'Digifly'}`
    },
    description: settings?.metaDescription || 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger. Book et møde i dag.',
    openGraph: {
      title: settings?.seoTitle || 'Digifly – Konsulentydelser i AI, automatisering og digital skalering',
      description: settings?.metaDescription || 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger.',
      type: 'website',
      images: settings?.socialShareImageUrl ? [settings.socialShareImageUrl] : [],
    },
    robots: {
      index: allowIndex,
      follow: allowIndex,
      googleBot: allowIndex
        ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
        : 'noindex,nofollow',
    },
    icons: {
      icon: settings?.faviconUrl || '/favicon.ico',
    },
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
