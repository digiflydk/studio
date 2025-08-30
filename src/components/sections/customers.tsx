
'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { type GeneralSettings } from '@/services/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomersSectionProps {
  settings: GeneralSettings | null;
}

export default function CustomersSection({ settings }: CustomersSectionProps) {
  const isMobile = useIsMobile();
  const customers = settings?.customers || [];

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (!customers || customers.length === 0) {
    return null;
  }
  
  const sectionPadding = settings?.sectionPadding?.cases; // Using cases padding for now
  const paddingTop = isMobile ? sectionPadding?.topMobile : sectionPadding?.top;
  const paddingBottom = isMobile ? sectionPadding?.bottomMobile : sectionPadding?.bottom;

  const style: React.CSSProperties = {
    paddingTop: paddingTop !== undefined ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom !== undefined ? `${paddingBottom}px` : undefined,
  };

  return (
    <section 
        id="customers" 
        className="bg-secondary" 
        style={style}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-12">
            <h3 className="text-lg font-semibold tracking-wider text-muted-foreground uppercase">Betroet af branchens bedste</h3>
        </div>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-12">
            {customers.map((customer) => (
              <CarouselItem key={customer.id} className="pl-12 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="relative h-16 w-full flex items-center justify-center">
                   <Image
                      src={customer.logoUrl}
                      alt={customer.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      data-ai-hint={customer.aiHint}
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
