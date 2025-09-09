
'use client';
import Image from 'next/image';
import type { GeneralSettings, SectionPadding } from '@/types/settings';
import { cn } from '@/lib/utils';
import { CSSProperties, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

function FullWidthImageHero({ settings }: { settings: GeneralSettings | null }) {
    const pathname = usePathname();
    const headline = settings?.heroHeadline || 'Flow. Automatisér. Skalér.';
    const description = settings?.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.';
    const imageUrl = settings?.heroImageUrl || 'https://picsum.photos/1920/1280';
    
    const textMaxWidth = settings?.heroTextMaxWidth ?? 700;

    const sectionPadding = settings?.sectionPadding?.hero;

    const heroStyles: CSSProperties & { [key: string]: string } = {
        '--text-max-width': `${textMaxWidth}px`,
        '--padding-top-mobile': sectionPadding?.topMobile !== undefined ? `${sectionPadding.topMobile}px` : '0px',
        '--padding-bottom-mobile': sectionPadding?.bottomMobile !== undefined ? `${sectionPadding.bottomMobile}px` : '128px',
        '--padding-top': sectionPadding?.top !== undefined ? `${sectionPadding.top}px` : '0px',
        '--padding-bottom': sectionPadding?.bottom !== undefined ? `${sectionPadding.bottom}px` : '192px',
    };
    
    const ctaStyle: React.CSSProperties = settings?.heroCtaTextSizeMobile ? { fontSize: `${settings.heroCtaTextSizeMobile}px` } : {};
    const ctaStyleDesktop: React.CSSProperties = settings?.heroCtaTextSize ? { fontSize: `${settings.heroCtaTextSize}px` } : {};

    const getLinkHref = (href: string) => {
        if (href.startsWith('#') && pathname !== '/') {
        return `/${href}`;
        }
        return href;
    }
    
    const verticalAlignmentClasses = {
        top: 'justify-start',
        center: 'justify-center',
        bottom: 'justify-end'
    }
    
    const horizontalAlignmentClasses = {
            left: 'items-start text-left',
            center: 'items-center text-center',
            right: 'items-end text-right'
    }

    return (
        <section
            id="hero"
            className="relative w-full"
            style={heroStyles}
        >
            <div className="absolute inset-0">
                <Image
                    src={imageUrl}
                    alt="Tech background"
                    data-ai-hint="tech background"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
            </div>
            
            <div className={cn(
                "relative container mx-auto px-4 md:px-6 flex flex-col min-h-fit",
                "pt-[var(--padding-top-mobile)] pb-[var(--padding-bottom-mobile)] md:pt-[var(--padding-top)] md:pb-[var(--padding-bottom)]",
                verticalAlignmentClasses[settings?.heroVerticalAlignment || 'center']
            )}>
                <div className={cn(
                    "flex flex-col space-y-6 w-full text-white",
                    horizontalAlignmentClasses[settings?.heroAlignment || 'center']
                )} style={{maxWidth: `${textMaxWidth}px`}}>
                <h1 
                    className={cn("text-h1", settings?.heroHeadlineColor)}
                >
                    {headline}
                </h1>
                <p className={cn("text-body", settings?.heroDescriptionColor)}>
                    {description}
                </p>
                {settings?.heroCtaEnabled && settings?.heroCtaText && settings?.heroCtaLink && (
                    <div className="pt-4">
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
            </div>
        </section>
    );
}

function TextWithImageGridHero({ settings }: { settings: GeneralSettings | null }) {
    const pathname = usePathname();
    const headline = settings?.heroHeadline || 'The all-in-one platform built for restaurants';
    const description = settings?.heroDescription || 'AI-powered restaurant software that makes daily operations easier and drives more orders.';
    
    const textMaxWidth = settings?.heroTextMaxWidth ?? 700;

    const sectionPadding = settings?.sectionPadding?.hero;

    const heroStyles: CSSProperties & { [key: string]: string } = {
         '--text-max-width': `${textMaxWidth}px`,
        '--padding-top-mobile': sectionPadding?.topMobile !== undefined ? `${sectionPadding.topMobile}px` : '0px',
        '--padding-bottom-mobile': sectionPadding?.bottomMobile !== undefined ? `${sectionPadding.bottomMobile}px` : '48px',
        '--padding-top': sectionPadding?.top !== undefined ? `${sectionPadding.top}px` : '0px',
        '--padding-bottom': sectionPadding?.bottom !== undefined ? `${sectionPadding.bottom}px` : '96px',
    };

    if (settings?.heroSectionBackgroundColor) {
        const { h, s, l } = settings.heroSectionBackgroundColor;
        heroStyles.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
    }

    const ctaStyle: React.CSSProperties = settings?.heroCtaTextSizeMobile ? { fontSize: `${settings.heroCtaTextSizeMobile}px` } : {};
    const ctaStyleDesktop: React.CSSProperties = settings?.heroCtaTextSize ? { fontSize: `${settings.heroCtaTextSize}px` } : {};
    
    const getLinkHref = (href: string) => {
        if (href.startsWith('#') && pathname !== '/') {
            return `/${href}`;
        }
        return href;
    };

    const images = [
        { url: settings?.heroGridImage1Url || 'https://picsum.photos/400/300?random=11', hint: settings?.heroGridImage1AiHint || 'restaurant order' },
        { url: settings?.heroGridImage2Url || 'https://picsum.photos/400/300?random=12', hint: settings?.heroGridImage2AiHint || 'laptop restaurant' },
        { url: settings?.heroGridImage3Url || 'https://picsum.photos/400/300?random=13', hint: settings?.heroGridImage3AiHint || 'phone payment' },
        { url: settings?.heroGridImage4Url || 'https://picsum.photos/400/300?random=14', hint: settings?.heroGridImage4AiHint || 'tablet POS' },
    ];

    return (
        <section id="hero" 
            className={cn("w-full py-[var(--padding-top-mobile)] md:py-[var(--padding-top)] pb-[var(--padding-bottom-mobile)] md:pb-[var(--padding-bottom)]", !settings?.heroSectionBackgroundColor && "bg-background")} 
            style={heroStyles}
        >
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="flex flex-col space-y-6" style={{maxWidth: `${textMaxWidth}px`}}>
                        <h1 className="text-h1 text-foreground">
                            {headline}
                        </h1>
                        <p className="text-body text-muted-foreground">
                            {description}
                        </p>
                        {settings?.heroCtaEnabled && settings?.heroCtaText && settings?.heroCtaLink && (
                            <div className="pt-4">
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
                     <div className="grid grid-cols-2 gap-4">
                        {images.map((image, index) => (
                            <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg group">
                                <Image
                                    src={image.url}
                                    alt={`Hero image ${index + 1}`}
                                    data-ai-hint={image.hint}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeroSectionInner({ settings }: { settings: GeneralSettings | null }) {
    const layout = settings?.heroLayout || 'fullWidthImage';
    
    if (layout === 'textWithImageGrid') {
        return <TextWithImageGridHero settings={settings} />;
    }
    
    return <FullWidthImageHero settings={settings} />;
}

export default function HeroSection({ settings }: { settings: GeneralSettings | null }) {
    return (
        <Suspense fallback={<section id="hero" className="relative w-full h-[75vh] min-h-[500px] max-h-[800px] bg-gray-200"></section>}>
            <HeroSectionInner settings={settings} />
        </Suspense>
    )
}
