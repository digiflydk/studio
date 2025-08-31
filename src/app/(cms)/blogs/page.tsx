
'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  saveBlogPostAction,
  deleteBlogPostAction,
  getBlogPostsAction,
} from '@/app/actions';
import type { BlogPost } from '@/services/settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Pencil, PlusCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Titel er påkrævet'),
  slug: z.string().min(3, 'Slug er påkrævet').regex(/^[a-z0-9-]+$/, 'Slug må kun indeholde små bogstaver, tal og bindestreger.'),
  content: z.string().min(10, 'Indhold er påkrævet'),
  featuredImageUrl: z.string().url('Ugyldig URL til billede'),
  metaDescription: z.string().min(10, 'Meta-beskrivelse er påkrævet').max(160, 'Meta-beskrivelse må højst være 160 tegn'),
  aiHint: z.string().optional(),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export default function CmsBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    const loadedPosts = await getBlogPostsAction();
    setPosts(loadedPosts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openEditDialog = (post: BlogPost) => {
    form.reset(post);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    form.reset({
      title: '',
      slug: '',
      content: '',
      featuredImageUrl: '',
      metaDescription: '',
      aiHint: '',
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: BlogPostFormValues) => {
    startTransition(async () => {
      const result = await saveBlogPostAction(data);
      toast({
        title: result.success ? 'Succes!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setPosts(result.posts);
        setIsDialogOpen(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Er du sikker på, at du vil slette dette blogindlæg?')) return;
    startTransition(async () => {
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
  
  const generateSlug = () => {
    const title = form.getValues('title');
    const slug = title
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .trim()
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
    form.setValue('slug', slug, { shouldValidate: true });
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Blogindlæg</h1>
          <p className="text-muted-foreground">Opret og administrer dine blogindlæg for SEO.</p>
        </div>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nyt Indlæg
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
                     <Button variant="outline" size="icon" onClick={() => openEditDialog(post)}>
                        <Pencil className="h-4 w-4" />
                     </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)} disabled={isSubmitting}>
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                  <DialogTitle>{form.getValues('id') ? 'Rediger' : 'Opret'} Blogindlæg</DialogTitle>
              </DialogHeader>
               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titel</FormLabel>
                                    <FormControl>
                                        <Input placeholder="En fængende titel..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Slug</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="unik-url-sti" {...field} />
                                        </FormControl>
                                        <Button type="button" variant="outline" onClick={generateSlug}>Generer</Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="metaDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Beskrivelse (SEO)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="En kort beskrivelse til Google (maks 160 tegn)" {...field} rows={3} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="featuredImageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fremhævet Billede URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="aiHint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>AI Billede Hint (valgfrit)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="F.eks. tech keyboard" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Indhold</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Skriv dit blogindlæg her... Brug \\n for nye linjer." {...field} rows={10} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Gem Blogindlæg
                        </Button>
                    </form>
                </Form>
          </DialogContent>
      </Dialog>

    </div>
  );
}
