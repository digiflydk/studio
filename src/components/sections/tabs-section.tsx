
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { type GeneralSettings, type TabbedContentItem } from '@/types/settings';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const defaultTabs: TabbedContentItem[] = [
  {
    title: 'Branded website & app',
    description:
      'Grow your customer base with your own AI-optimised, direct-to-consumer ordering website and mobile app. Built to maximise conversions and keep your brand front and centre, our platforms are fast, intuitive, and SEO-friendly, helping you capture more orders without giving up margin to third-party marketplaces.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    aiHint: 'branded website app',
    link: '#',
    linkText: 'Learn More',
  },
  {
    title: 'Loyalty & retention',
    description:
      'Turn first-time customers into lifelong fans with our automated loyalty and retention tools. From personalised rewards to targeted marketing campaigns, we make it easy to keep your customers coming back for more.',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    aiHint: 'customer loyalty program',
    link: '#',
    linkText: 'Discover Features',
  },
  {
    title: 'Automated upsell',
    description:
      "Increase your average order value with our intelligent, automated upsell engine. Our AI analyses customer behaviour to suggest relevant add-ons and upgrades at the perfect moment, boosting your revenue effortlessly.",
    imageUrl: 'https://picsum.photos/800/600?random=3',
    aiHint: 'automated upsell AI',
    link: '#',
    linkText: 'See it in Action',
  },
    {
    title: 'Delivery network',
    description:
      "Tap into a vast network of delivery partners to offer fast, reliable, and cost-effective delivery to your customers. Our integrated system handles all the logistics, so you can focus on what you do best: making great food.",
    imageUrl: 'https://picsum.photos/800/600?random=4',
    aiHint: 'delivery network logistics',
    link: '#',
    linkText: 'Explore Network',
  },
    {
    title: 'Marketing Tools',
    description:
      "Take control of your marketing with a suite of powerful, easy-to-use tools. From email and SMS campaigns to social media integration and SEO optimisation, we provide everything you need to grow your brand's presence.",
    imageUrl: 'https://picsum.photos/800/600?random=5',
    aiHint: 'digital marketing tools',
    link: '#',
    linkText: 'View Tools',
  },
];

interface TabsSectionProps {
  settings: GeneralSettings | null;
}

export default function TabsSection({ settings }: TabsSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const title = settings?.tabbedContentSectionTitle || 'Grow your orders';
  const items = settings?.tabbedContentItems?.length ? settings.tabbedContentItems : defaultTabs;

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const sectionPadding = settings?.sectionPadding?.tabs;
  const style: React.CSSProperties & { [key: string]: string } = {
    '--padding-top-mobile': sectionPadding?.topMobile !== undefined ? `${sectionPadding.topMobile}px` : '48px',
    '--padding-bottom-mobile': sectionPadding?.bottomMobile !== undefined ? `${sectionPadding.bottomMobile}px` : '48px',
    '--padding-top': sectionPadding?.top !== undefined ? `${sectionPadding.top}px` : '96px',
    '--padding-bottom': sectionPadding?.bottom !== undefined ? `${sectionPadding.bottom}px` : '96px',
  };

  if (settings?.tabbedContentSectionBackgroundColor) {
    const { h, s, l } = settings.tabbedContentSectionBackgroundColor;
    style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  return (
    <section 
        id="tabs" 
        style={style}
        className={cn('py-[var(--padding-top-mobile)] md:py-[var(--padding-top)] pb-[var(--padding-bottom-mobile)] md:pb-[var(--padding-bottom)]', !settings?.tabbedContentSectionBackgroundColor && 'bg-secondary')}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-h2 tracking-tight">{title}</h2>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => api?.scrollPrev()} disabled={!api?.canScrollPrev()}>
              <ChevronLeft className="h-4 w-4" />
              <span className='sr-only'>Previous</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => api?.scrollNext()} disabled={!api?.canScrollNext()}>
              <ChevronRight className="h-4 w-4" />
               <span className='sr-only'>Next</span>
            </Button>
          </div>
        </div>

        <div className="border-b mb-12">
          <div className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-px">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap',
                  current === index
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                    current === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        <Carousel setApi={setApi}>
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className='relative aspect-video rounded-lg overflow-hidden shadow-lg'>
                        <Image 
                            src={item.imageUrl} 
                            alt={item.title} 
                            fill 
                            className='object-cover'
                            sizes='(max-width: 768px) 100vw, 50vw'
                            data-ai-hint={item.aiHint}
                        />
                    </div>
                    <div className='space-y-4'>
                        <h3 className='text-h3'>{item.title}</h3>
                        <p className='text-body text-muted-foreground'>{item.description}</p>
                        <div className="pt-2">
                           <Button asChild>
                                <Link href={item.link}>{item.linkText}</Link>
                           </Button>
                        </div>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
