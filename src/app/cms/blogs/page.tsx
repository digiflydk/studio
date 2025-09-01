
'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  deleteBlogPostAction,
  getBlogPostsAction,
} from '@/app/actions';
import type { BlogPost } from '@/types/settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Pencil, PlusCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function CmsBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, startDeleteTransition] = useTransition();
  const { toast } = useToast();

  const fetchPosts = async () => {
    setIsLoading(true);
    const loadedPosts = await getBlogPostsAction();
    setPosts(loadedPosts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm('Er du sikker på, at du vil slette dette blogindlæg?')) return;
    startDeleteTransition(async () => {
      const result = await deleteBlogPostAction(id);
      toast({
        title: result.success ? 'Succes!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setPosts(result.posts);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blogindlæg</h1>
          <p className="text-muted-foreground">Opret og administrer dine blogindlæg for SEO.</p>
        </div>
        <Button asChild>
          <Link href="/cms/blogs/edit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nyt Indlæg
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Eksisterende Indlæg</CardTitle>
          <CardDescription>Liste over alle publicerede blogindlæg.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center gap-4 p-3 border rounded-lg bg-muted/20">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.title}
                    width={100}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Publiceret: {format(new Date(post.publishedAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" asChild>
                       <Link href={`/blog/${post.slug}`} target="_blank">
                         <ExternalLink className="h-4 w-4" />
                       </Link>
                     </Button>
                     <Button variant="outline" size="icon" asChild>
                        <Link href={`/cms/blogs/edit?id=${post.id}`}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                     </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)} disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertTitle>Ingen blogindlæg fundet</AlertTitle>
              <AlertDescription>
                Du har endnu ikke oprettet nogle blogindlæg. Klik på "Nyt Indlæg" for at komme i gang.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
