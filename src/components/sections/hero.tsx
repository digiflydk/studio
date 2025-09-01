'use client';
import Image from 'next/image';
import type { GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


export default function HeroSection({ settings }: { settings: GeneralSettings | null }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const headline = settings?.heroHeadline || 'Flow. Automatisér. Skalér.';
  const description = settings?.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.';
  const imageUrl = settings?.heroImageUrl || 'https://picsum.photos/1920/1280';
  
  const headlineDesktopSize = settings?.heroHeadlineSize ?? 64;
  const headlineMobileSize = settings?.heroHeadlineSizeMobile ?? 40;
  const descriptionDesktopSize = settings?.heroDescriptionSize ?? 18;
  const descriptionMobileSize = settings?.heroDescriptionSizeMobile ?? 16;
  const textMaxWidth = settings?.heroTextMaxWidth ?? 700;

  const headerHeight = settings?.headerHeight || 64;

  const heroStyles = {
    '--headline-desktop-size': `${headlineDesktopSize}px`,
    '--headline-mobile-size': `${headlineMobileSize}px`,
    '--description-desktop-size': `${descriptionDesktopSize}px`,
    '--description-mobile-size': `${descriptionMobileSize}px`,
    '--text-max-width': `${textMaxWidth}px`,
    '--header-height': `${headerHeight}px`,
  } as CSSProperties;
  
  const ctaTextSize = isMobile ? settings?.heroCtaTextSizeMobile : settings?.heroCtaTextSize;
  const ctaStyle: React.CSSProperties = ctaTextSize ? { fontSize: `${ctaTextSize}px` } : {};

  const alignmentClasses = {
    vertical: {
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end',
    },
    horizontal: {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    },
  };

  const verticalAlign = settings?.heroVerticalAlignment || 'center';
  const horizontalAlign = settings?.heroAlignment || 'center';

  const getLinkHref = (href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      return `/${href}`;
    }
    return href;
  }

  return (
    <section
      id="hero"
      className="relative w-full h-[75vh] min-h-[500px] max-h-[800px]"
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
          .hero-text-container {
            max-width: var(--text-max-width);
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
      <div className="absolute inset-0">
         <Image
            src={imageUrl}
            alt="Tech background"
            data-ai-hint="tech background"
            fill
            className="object-cover -z-10 brightness-50"
            priority
        />
      </div>
     
      <div className={cn(
        "w-full h-full text-white flex",
        "pt-[calc(var(--header-height)_+_4rem)] pb-16",
        "container mx-auto px-4 md:px-6",
        alignmentClasses.vertical[verticalAlign],
        horizontalAlign === 'center' ? 'justify-center' : horizontalAlign === 'left' ? 'justify-start' : 'justify-end'
      )}>
        <div className={cn(
            "flex flex-col space-y-6 hero-text-container z-10",
            alignmentClasses.horizontal[horizontalAlign]
        )}>
          <h1 
            className={cn("hero-headline font-bold tracking-tight font-headline", settings?.heroHeadlineColor)}
          >
            {headline}
          </h1>
          <p 
            className={cn("hero-description text-body", settings?.heroDescriptionColor || 'text-primary-foreground/80')}
          >
            {description}
          </p>
          {settings?.heroCtaEnabled && settings?.heroCtaText && settings?.heroCtaLink && (
             <div className="pt-4">
                <Button
                  asChild
                  size={settings.heroCtaSize || 'lg'}
                  variant={settings.heroCtaVariant || 'default'}
                  style={ctaStyle}
                >
                  <Link href={getLinkHref(settings.heroCtaLink)}>
                    {settings.heroCtaText}
                    {settings.heroCtaVariant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Link>
                </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
