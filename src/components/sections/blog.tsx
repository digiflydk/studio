'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import type { GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


interface BlogSectionProps {
    settings: GeneralSettings | null
}

export default function BlogSection({ settings }: BlogSectionProps) {
  const isMobile = useIsMobile();
  const posts = settings?.blogPosts || [];
  const title = settings?.blogSectionTitle || "Seneste fra bloggen";
  const description = settings?.blogSectionDescription || "Læs vores seneste indlæg om teknologi, AI og digitalisering.";
  const alignment = settings?.blogSectionAlignment || 'center';

  if (!posts || posts.length === 0) {
    return null;
  }
  
  const latestPosts = posts.slice(0, 3);

  const titleStyle: React.CSSProperties = {
    fontSize: settings?.blogSectionTitleSize ? `${settings.blogSectionTitleSize}px` : undefined,
  };
  const descriptionStyle: React.CSSProperties = {
    fontSize: settings?.blogSectionDescriptionSize ? `${settings.blogSectionDescriptionSize}px` : undefined,
  };
  
  const sectionPadding = settings?.sectionPadding?.blog;
  const paddingTop = isMobile ? sectionPadding?.topMobile : sectionPadding?.top;
  const paddingBottom = isMobile ? sectionPadding?.bottomMobile : sectionPadding?.bottom;

  const style: React.CSSProperties = {
    paddingTop: paddingTop !== undefined ? `${paddingTop}px` : undefined,
    paddingBottom: paddingBottom !== undefined ? `${paddingBottom}px` : undefined,
  };
  
  if (settings?.blogSectionBackgroundColor) {
    const { h, s, l } = settings.blogSectionBackgroundColor;
    style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <section 
        id="blog" 
        style={style}
        className={cn(!settings?.blogSectionBackgroundColor && 'bg-background')}
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className={cn("mb-12", alignmentClasses[alignment])}>
           <h2 
            className={cn("text-h2 font-bold tracking-tight", settings?.blogSectionTitleColor || "text-black")}
            style={titleStyle}
          >
            {title}
          </h2>
          <p 
            className={cn("mt-4 max-w-2xl text-body", settings?.blogSectionDescriptionColor || "text-muted-foreground", {
                'mx-auto': alignment === 'center',
                'ml-auto': alignment === 'right',
                'mr-0': alignment === 'right',
                'mr-auto': alignment === 'left',
                'ml-0': alignment === 'left',
            })}
            style={descriptionStyle}
          >
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="flex flex-col h-full overflow-hidden transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="relative w-full h-48">
                    <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        data-ai-hint={post.aiHint}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                    </div>
                <CardHeader className="flex-grow">
                    <CardTitle className="mb-2 text-h4 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription>{post.metaDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                       {format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale: da })}
                    </p>
                </CardContent>
                </Card>
            </Link>
          ))}
        </div>
        {posts.length > 3 && (
            <div className="mt-12 text-center">
                <Link href="/blog" className={buttonVariants({ size: 'lg' })}>
                    Se alle indlæg
                </Link>
            </div>
        )}
      </div>
    </section>
  );
}
