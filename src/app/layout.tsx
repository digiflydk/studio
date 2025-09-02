
import type { Metadata } from 'next';
import './globals.css';
import { getGeneralSettings } from '@/services/settings';
import { ThemeContextWrapper } from '@/context/ThemeContextWrapper';

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
  },
  icons: {
    icon: '/favicon.ico', // Default fallback
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGeneralSettings();

  return (
    <html lang="en" className="scroll-smooth">
      <body>
         <ThemeContextWrapper settings={settings}>
            {children}
        </ThemeContextWrapper>
      </body>
    </html>
  );
}
