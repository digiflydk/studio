
import type { Metadata } from 'next';
import './globals.css';

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
    images: [],
  },
  robots: {
      index: true,
      follow: true,
      googleBot: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  },
  icons: {
    icon: '/favicon.ico',
  },
};


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
