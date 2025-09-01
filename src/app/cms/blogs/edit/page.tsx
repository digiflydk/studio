
'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveBlogPostAction, getBlogPostAction } from '@/app/actions';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

function EditBlogPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  
  const [isSubmitting, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(!!postId);
  const { toast } = useToast();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      featuredImageUrl: '',
      metaDescription: '',
      aiHint: '',
    },
  });

  useEffect(() => {
    if (postId) {
      setIsLoading(true);
      getBlogPostAction(postId).then(post => {
        if (post) {
          form.reset(post);
        } else {
            toast({ title: "Fejl", description: "Kunne ikke finde blogindlægget.", variant: "destructive"});
            router.push('/cms/blogs');
        }
        setIsLoading(false);
      });
    }
  }, [postId, form, router, toast]);

  const onSubmit = (data: BlogPostFormValues) => {
    startTransition(async () => {
      const result = await saveBlogPostAction(data);
      toast({
        title: result.success ? 'Succes!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        router.push('/cms/blogs');
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

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{postId ? 'Rediger' : 'Opret'} Blogindlæg</CardTitle>
                    <CardDescription>Udfyld detaljerne for dit blogindlæg. Husk at gemme.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                                    <Textarea placeholder="Skriv dit blogindlæg her..." {...field} rows={15} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/cms/blogs">Annuller</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Gem Blogindlæg
                </Button>
            </div>
        </form>
    </Form>
  );
}


export default function CmsEditBlogPage() {
    return (
        <div className="space-y-4">
            <div>
                 <Button variant="outline" asChild>
                    <Link href="/cms/blogs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tilbage til oversigt
                    </Link>
                </Button>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <EditBlogPostForm />
            </Suspense>
        </div>
    )
}
