
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { da } from 'date-fns/locale';

export default async function BlogPage() {
  const posts = await getBlogPostsAction();

  return (
    <div className="bg-secondary">
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-h1 font-bold tracking-tight">Vores Blog</h1>
            <p className="mt-4 text-body max-w-2xl mx-auto text-muted-foreground">
              De seneste nyheder, artikler og indsigter fra vores team.
            </p>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
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
          ) : (
             <div className="text-center py-16">
                <h2 className="text-h3 font-semibold">Der er ingen blogindlæg endnu</h2>
                <p className="mt-2 text-muted-foreground">Kom snart tilbage for at læse vores seneste artikler.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
