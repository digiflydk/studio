
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGeneralSettings } from '@/services/settings';
import Analytics from '@/components/analytics';
import { ReactNode, Suspense } from 'react';
import Script from 'next/script';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Loader2 } from 'lucide-react';
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
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [...openGraphImages, ...previousImages],
      type: 'website',
    },
    robots: {},
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
        <Script id="autoscroll-killer" strategy="beforeInteractive">
{`(function(){
  try {
    // 1) PRE-PAINT LOCK: deaktiver browserens auto-justering
    var _siv = Element.prototype.scrollIntoView;
    var _sto = window.scrollTo;
    var unlocked = false;

    if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }

    // Fjern hash globalt (uanset sti) og gå til top
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    _sto.call(window, 0, 0);

    // Bloker programmatisk scroll i den helt tidlige fase
    Element.prototype.scrollIntoView = function(){
      if (unlocked) return _siv.apply(this, arguments);
      // Ignorer kaldet indtil unlock
    };
    window.scrollTo = function(){
      if (unlocked) return _sto.apply(window, arguments);
      // Ignorer kaldet indtil unlock
    };

    // 2) HASHCHANGE GUARD: hvis noget sætter hash, fjern den igen
    window.addEventListener('hashchange', function(ev){
      try {
        if (location.hash) {
          history.replaceState(null, '', location.pathname + location.search);
          _sto.call(window, 0, 0);
        }
        if (ev && ev.preventDefault) ev.preventDefault();
      } catch(_) {}
    }, { passive: false });

    // 3) LOAD/PAGESHOW GUARD: sikre top efter resource-load / bfcache
    window.addEventListener('load', function(){
      try { _sto.call(window, 0, 0); } catch(_) {}
    }, { once: true });
    window.addEventListener('pageshow', function(e){
      try { if (e && e.persisted) _sto.call(window, 0, 0); } catch(_) {}
    });

    // 4) UNLOCK: genaktiver scroll efter 2 frames (brugeren kan nu klikke i menu)
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        Element.prototype.scrollIntoView = _siv;
        window.scrollTo = _sto;
        unlocked = true;
      });
    });
  } catch(_) {}
})();`}
</Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Analytics />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider settings={settings}>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
