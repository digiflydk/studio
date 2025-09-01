
'use client';
import Image from 'next/image';
import { type GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


export default function FeatureSection({ settings }: { settings: GeneralSettings | null }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    
    const heading = settings?.featureSectionHeading || 'Fremhævet Overskrift';
    const body = settings?.featureSectionBody || 'Dette er en beskrivelse af den fremhævede funktion. Du kan redigere denne tekst i CMS\'et. Det er et godt sted at uddybe fordelene ved dit produkt eller din service.';
    const imageUrl = settings?.featureSectionImageUrl || 'https://picsum.photos/800/600';
    const aiHint = settings?.featureSectionAiHint || 'featured content';
    const ctaText = settings?.featureSectionCtaText || 'Lær Mere';
    const ctaLink = settings?.featureSectionCtaLink || '#';
    const ctaVariant = settings?.featureSectionCtaVariant || 'default';
    const ctaSize = settings?.featureSectionCtaSize || 'lg';

    const headingDesktopSize = settings?.featureSectionHeadingSize ?? 48;
    const headingMobileSize = settings?.featureSectionHeadingSizeMobile ?? 36;
    const bodyDesktopSize = settings?.featureSectionBodySize ?? 18;
    const bodyMobileSize = settings?.featureSectionBodySizeMobile ?? 16;
    const ctaDesktopSize = settings?.featureSectionCtaTextSize ?? 16;
    const ctaMobileSize = settings?.featureSectionCtaTextSizeMobile ?? 14;

    const sectionPadding = settings?.sectionPadding?.feature;
    const paddingTop = isMobile ? sectionPadding?.topMobile : sectionPadding?.top;
    const paddingBottom = isMobile ? sectionPadding?.bottomMobile : sectionPadding?.bottom;

    const sectionStyle: CSSProperties = {
        paddingTop: paddingTop !== undefined ? `${paddingTop}px` : undefined,
        paddingBottom: paddingBottom !== undefined ? `${paddingBottom}px` : undefined,
    };
    if (settings?.featureSectionBackgroundColor) {
        const { h, s, l } = settings.featureSectionBackgroundColor;
        sectionStyle.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
    }

    const headingStyle: CSSProperties = {
        fontSize: isMobile ? `${headingMobileSize}px` : `${headingDesktopSize}px`,
    };
    const bodyStyle: CSSProperties = {
        fontSize: isMobile ? `${bodyMobileSize}px` : `${bodyDesktopSize}px`,
    };
    const ctaStyle: CSSProperties = {
        fontSize: isMobile ? `${ctaMobileSize}px` : `${ctaDesktopSize}px`,
    };

    const getLinkHref = (href: string) => {
        if (href.startsWith('#') && pathname !== '/') {
            return `/${href}`;
        }
        return href;
    };

    const alignment = settings?.featureSectionAlignment || 'left';
    const alignmentClasses = {
        left: 'md:text-left md:items-start',
        center: 'md:text-center md:items-center',
        right: 'md:text-right md:items-end',
    };
    
    const textContent = (
        <div className={cn('flex flex-col space-y-6 text-center', alignmentClasses[alignment])}>
            <h2
                className={cn("text-h2 font-bold tracking-tight", settings?.featureSectionHeadingColor)}
                style={headingStyle}
            >
                {heading}
            </h2>
            <p
                className={cn("text-body", settings?.featureSectionBodyColor || 'text-muted-foreground')}
                style={bodyStyle}
            >
                {body}
            </p>
            {ctaText && ctaLink && (
                <div className="pt-4">
                    <Button
                        asChild
                        size={ctaSize}
                        variant={ctaVariant}
                        style={ctaStyle}
                    >
                        <Link href={getLinkHref(ctaLink)}>
                            {ctaText}
                            {ctaVariant === 'pill' && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
    
    const imageContent = (
         <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
                src={imageUrl}
                alt={heading}
                data-ai-hint={aiHint}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>
    );

    return (
        <section id="feature" style={sectionStyle}>
            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {alignment === 'right' ? (
                        <>
                            {imageContent}
                            {textContent}
                        </>
                    ) : (
                        <>
                            {textContent}
                            {imageContent}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
