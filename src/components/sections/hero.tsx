
'use client';
import { Button } from '@/components/ui/button';
import { type GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function HeroSection({ settings }: { settings: GeneralSettings | null }) {
    const pathname = usePathname();
    const headline = settings?.heroHeadline ?? 'Flow. Automatisér. Skalér.';
    const description = settings?.heroDescription ?? 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.';
    
    const headlineStyle: React.CSSProperties = {
        color: settings?.heroHeadlineColor ? `var(--${settings.heroHeadlineColor.replace('text-', '')})` : undefined,
    };
    const descriptionStyle: React.CSSProperties = {
        color: settings?.heroDescriptionColor ? `var(--${settings.heroDescriptionColor.replace('text-', '')})` : undefined,
    };
    
    const sectionStyle: React.CSSProperties & { [key: string]: string } = {
        '--hero-headline-size-mobile': settings?.heroHeadlineSizeMobile ? `${settings.heroHeadlineSizeMobile}px` : '40px',
        '--hero-headline-size': settings?.heroHeadlineSize ? `${settings.heroHeadlineSize}px` : '64px',
        '--hero-description-size-mobile': settings?.heroDescriptionSizeMobile ? `${settings.heroDescriptionSizeMobile}px` : '16px',
        '--hero-description-size': settings?.heroDescriptionSize ? `${settings.heroDescriptionSize}px` : '18px',
        '--hero-padding-top-mobile': settings?.sectionPadding?.hero?.topMobile ? `${settings.sectionPadding.hero.topMobile}px` : '128px',
        '--hero-padding-bottom-mobile': settings?.sectionPadding?.hero?.bottomMobile ? `${settings.sectionPadding.hero.bottomMobile}px` : '128px',
        '--hero-padding-top': settings?.sectionPadding?.hero?.top ? `${settings.sectionPadding.hero.top}px` : '192px',
        '--hero-padding-bottom': settings?.sectionPadding?.hero?.bottom ? `${settings.sectionPadding.hero.bottom}px` : '192px',
    };

    if (settings?.heroLayout === 'textWithImageGrid' && settings?.heroSectionBackgroundColor) {
        const { h, s, l } = settings.heroSectionBackgroundColor;
        sectionStyle.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
    }

    const ctaStyle: React.CSSProperties = settings?.heroCtaTextSizeMobile ? { fontSize: `${settings.heroCtaTextSizeMobile}px` } : {};
    const ctaStyleDesktop: React.CSSProperties = settings?.heroCtaTextSize ? { fontSize: `${settings.heroCtaTextSize}px` } : {};
    
    const getLinkHref = (href: string) => {
        if (href.startsWith('#') && pathname !== '/') {
            return `/${href}`;
        }
        return href;
    };
    
    const textMaxWidth = settings?.heroTextMaxWidth || 700;
    const horizontalAlign = settings?.heroAlignment || 'center';
    const verticalAlign = settings?.heroVerticalAlignment || 'center';

    const alignmentClasses = {
        container: {
            'top': 'justify-start',
            'center': 'justify-center',
            'bottom': 'justify-end',
        },
        text: {
            'left': 'text-left items-start',
            'center': 'text-center items-center',
            'right': 'text-right items-end',
        }
    };
    
    const heroContent = (
        <div 
            className={cn("flex flex-col", alignmentClasses.text[horizontalAlign])}
            style={{ maxWidth: `${textMaxWidth}px` }}
        >
            <h1
                className="text-[length:var(--hero-headline-size-mobile)] md:text-[length:var(--hero-headline-size)] font-bold leading-tight tracking-tighter"
                style={headlineStyle}
            >
                {headline}
            </h1>
            <p
                className="mt-6 text-[length:var(--hero-description-size-mobile)] md:text-[length:var(--hero-description-size)] text-primary-foreground/80"
                style={descriptionStyle}
            >
                {description}
            </p>

            {settings?.heroCtaEnabled && settings?.heroCtaText && settings?.heroCtaLink && (
                <div className="mt-8">
                     <Button
                        asChild
                        size={settings.heroCtaSize || 'lg'}
                        variant={settings.heroCtaVariant || 'default'}
                        className="md:hidden"
                        style={ctaStyle}
                    >
                        <Link href={getLinkHref(settings.heroCtaLink)}>
                            {settings.heroCtaText}
                             {settings.heroCtaVariant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Link>
                    </Button>
                     <Button
                        asChild
                        size={settings.heroCtaSize || 'lg'}
                        variant={settings.heroCtaVariant || 'default'}
                        className="hidden md:inline-flex"
                        style={ctaStyleDesktop}
                    >
                        <Link href={getLinkHref(settings.heroCtaLink)}>
                            {settings.heroCtaText}
                             {settings.heroCtaVariant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
    
    const imageGrid = (
        <div className={cn(
            "grid grid-cols-2 grid-rows-2 gap-4 md:w-3/5",
            {
                'md:ml-auto': horizontalAlign === 'right',
            }
        )}>
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src={settings?.heroGridImage1Url || `https://picsum.photos/400/300?random=11`}
                    alt="Hero image 1"
                    fill
                    className="object-cover"
                    data-ai-hint={settings?.heroGridImage1AiHint || ''}
                />
            </div>
             <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src={settings?.heroGridImage2Url || `https://picsum.photos/400/300?random=12`}
                    alt="Hero image 2"
                    fill
                    className="object-cover"
                    data-ai-hint={settings?.heroGridImage2AiHint || ''}
                />
            </div>
             <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src={settings?.heroGridImage3Url || `https://picsum.photos/400/300?random=13`}
                    alt="Hero image 3"
                    fill
                    className="object-cover"
                    data-ai-hint={settings?.heroGridImage3AiHint || ''}
                />
            </div>
             <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image 
                    src={settings?.heroGridImage4Url || `https://picsum.photos/400/300?random=14`}
                    alt="Hero image 4"
                    fill
                    className="object-cover"
                    data-ai-hint={settings?.heroGridImage4AiHint || ''}
                />
            </div>
        </div>
    );

    if (settings?.heroLayout === 'textWithImageGrid') {
        return (
            <section id="hero" style={sectionStyle} className="py-[var(--hero-padding-top-mobile)] md:py-[var(--hero-padding-top)] pb-[var(--hero-padding-bottom-mobile)] md:pb-[var(--hero-padding-bottom)]">
                 <div className="container mx-auto max-w-7xl px-4 md:px-6">
                     <div className={cn("grid md:grid-cols-2 gap-12 items-center")}>
                         {horizontalAlign === 'right' ? (
                            <>
                                {imageGrid}
                                {heroContent}
                            </>
                         ) : (
                            <>
                                {heroContent}
                                {imageGrid}
                            </>
                         )}
                     </div>
                 </div>
            </section>
        )
    }

    // Default to fullWidthImage
    return (
        <section
            id="hero"
            className="relative w-full text-primary-foreground"
            style={sectionStyle}
        >
            <div className="absolute inset-0">
                <Image
                    src={settings?.heroImageUrl || 'https://picsum.photos/1920/1280'}
                    alt={headline}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className={cn("relative container mx-auto max-w-7xl px-4 md:px-6 flex min-h-[calc(100vh_-_var(--header-h,72px))] py-[var(--hero-padding-top-mobile)] md:py-[var(--hero-padding-top)] pb-[var(--hero-padding-bottom-mobile)] md:pb-[var(--hero-padding-bottom)]", alignmentClasses.container[verticalAlign])}>
                <div className={cn("w-full flex", {
                    'justify-start': horizontalAlign === 'left',
                    'justify-center': horizontalAlign === 'center',
                    'justify-end': horizontalAlign === 'right',
                })}>
                    {heroContent}
                </div>
            </div>
        </section>
    );
}

    