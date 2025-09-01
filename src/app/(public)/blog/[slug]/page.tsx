
import { getBlogPostsAction } from '@/app/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import { Calendar, Tag } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getBlogPostsAction();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Blogindlæg ikke fundet',
    };
  }

  return {
    title: post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      images: [
        {
          url: post.featuredImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
    },
  };
}

// Statically generate routes for all blog posts
export async function generateStaticParams() {
  const posts = await getBlogPostsAction();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// A simple markdown to HTML converter
function Markdown({ content }: { content: string }) {
  const html = content
    .split('\n')
    .map(line => {
        line = line.trim();
        if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
        if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
        if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
        if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
        if (line === '') return '<br />';
        return `<p>${line}</p>`;
    })
    .join('')
    // Basic formatting for bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  return (
    <div
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}


export default async function BlogPostPage({ params }: Props) {
  const posts = await getBlogPostsAction();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-background py-12 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-h1 font-bold tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(post.publishedAt), 'd. MMMM yyyy', { locale: da })}</span>
            </div>
          </div>
        </header>

        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-12">
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            data-ai-hint={post.aiHint}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose max-w-none mx-auto text-body">
            <Markdown content={post.content} />
        </div>
      </div>
    </article>
  );
}
