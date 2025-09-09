
import type { Metadata } from 'next';
import './globals.css';
import { getGeneralSettings } from '@/services/settings';
import CookieConsent from '@/components/CookieConsent';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const allowIndex = settings?.allowSearchEngineIndexing !== false;
  const faviconUrl = settings?.faviconUrl;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digifly.dk';
  const ogImage = settings?.socialShareImageUrl || `${siteUrl}/og-image.png`;

  const icons = faviconUrl
    ? {
        icon: [{ url: faviconUrl, rel: "icon" }, { url: "/favicon.ico", sizes: "any", rel: "icon" }],
        shortcut: [{ url: faviconUrl, rel: "shortcut icon" }],
        apple: [{ url: faviconUrl, rel: "apple-touch-icon" }, {url: '/apple-touch-icon.png', rel: 'apple-touch-icon'}]
      }
    : {
        icon: "/favicon.ico",
        apple: '/apple-touch-icon.png'
      };

  const title = settings?.seoTitle || 'Digifly – Konsulentydelser i AI, automatisering og digital skalering';
  const description = settings?.metaDescription || 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger.';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings?.websiteTitle || 'Digifly'}`
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: siteUrl,
      siteName: settings?.websiteTitle || 'Digifly',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [ogImage],
    },
    robots: {
      index: allowIndex,
      follow: allowIndex,
      googleBot: allowIndex
        ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
        : 'noindex,nofollow',
    },
    icons,
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="da" className="scroll-smooth">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
