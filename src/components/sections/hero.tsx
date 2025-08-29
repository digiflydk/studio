import Image from 'next/image';
import { type GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

export default function HeroSection({ settings }: { settings: GeneralSettings | null }) {

  const headline = settings?.heroHeadline || 'Flow. Automatisér. Skalér.';
  const description = settings?.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.';
  const imageUrl = settings?.heroImageUrl || 'https://picsum.photos/1920/1280';
  
  const headlineDesktopSize = settings?.heroHeadlineSize ?? 64;
  const headlineMobileSize = settings?.heroHeadlineSizeMobile ?? 40;
  const descriptionDesktopSize = settings?.heroDescriptionSize ?? 18;
  const descriptionMobileSize = settings?.heroDescriptionSizeMobile ?? 16;
  
  const heroStyles = {
    '--headline-desktop-size': `${headlineDesktopSize}px`,
    '--headline-mobile-size': `${headlineMobileSize}px`,
    '--description-desktop-size': `${descriptionDesktopSize}px`,
    '--description-mobile-size': `${descriptionMobileSize}px`,
  } as CSSProperties;

  return (
    <section
      id="hero"
      className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] flex items-center justify-center text-center py-0"
      style={heroStyles}
    >
      <style>
        {`
          .hero-headline {
            font-size: var(--headline-mobile-size);
          }
          .hero-description {
            font-size: var(--description-mobile-size);
          }
          @media (min-width: 768px) {
            .hero-headline {
              font-size: var(--headline-desktop-size);
            }
            .hero-description {
              font-size: var(--description-desktop-size);
            }
          }
        `}
      </style>
      <Image
        src={imageUrl}
        alt="Tech background"
        data-ai-hint="tech background"
        fill
        className="object-cover -z-10 brightness-50"
        priority
      />
      <div className="container px-4 md:px-6 text-white">
        <div className="flex flex-col items-center space-y-6">
          <h1 
            className={cn("hero-headline font-bold tracking-tight font-headline", settings?.heroHeadlineColor)}
          >
            {headline}
          </h1>
          <p 
            className={cn("hero-description max-w-[700px] text-body", settings?.heroDescriptionColor || 'text-primary-foreground/80')}
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
