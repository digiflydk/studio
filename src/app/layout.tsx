

import type { Metadata } from 'next';
import './globals.css';
import { getGeneralSettings } from '@/services/settings';
import DesignProvider from '@/providers/DesignProvider';
import { makeVarsCss } from '@/lib/ui/applyDesignVars';
import { AdminToolbar } from '@/components/admin/AdminToolbar';
import { ThemeProvider } from '@/context/ThemeContext';


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGeneralSettings();
  const allowIndex = settings?.allowSearchEngineIndexing !== false;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://digifly.dk';
  const ogImage = settings?.socialShareImageUrl || `${siteUrl}/og-image.png`;

  const title = settings?.seoTitle || 'Digifly – Konsulentydelser i AI, automatisering og digital skalering';
  const description = settings?.metaDescription || 'Vi hjælper virksomheder med digital transformation, automatisering og AI-drevne løsninger.';

  const faviconUrl = settings?.faviconUrl || '/favicon.ico';

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
    icons: {
        icon: faviconUrl,
        shortcut: faviconUrl,
        apple: "/apple-touch-icon.png",
    },
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGeneralSettings();
  const css = makeVarsCss(settings);

  return (
    <html lang="da" className="scroll-smooth">
      <head>
        {css && <style id="theme-vars">{css}</style>}
      </head>
      <body>
        <ThemeProvider settings={settings}>
            <DesignProvider initialDesign={settings}>
                {children}
                <AdminToolbar />
            </DesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
