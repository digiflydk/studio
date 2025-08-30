
'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  saveCustomerAction,
  deleteCustomerAction,
  getCustomersAction,
} from '@/app/actions';
import type { Customer } from '@/services/settings';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

const customerFormSchema = z.object({
  name: z.string().min(1, 'Navn er påkrævet'),
  logoUrl: z.string().url('Ugyldig URL'),
  aiHint: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function CmsCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      aiHint: '',
    },
  });

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      const loadedCustomers = await getCustomersAction();
      setCustomers(loadedCustomers);
      setIsLoading(false);
    }
    loadCustomers();
  }, []);

  const onSubmit = (data: CustomerFormValues) => {
    startTransition(async () => {
      const result = await saveCustomerAction(data);
      toast({
        title: result.success ? 'Succes!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setCustomers(result.customers);
        form.reset();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCustomerAction(id);
       toast({
        title: result.success ? 'Succes!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      if (result.success) {
        setCustomers(result.customers);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Kunder</h1>
        <p className="text-muted-foreground">
          Administrer logoer for de kunder, der skal vises på din hjemmeside.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Eksisterende Kunder</CardTitle>
                </CardHeader>
                <CardContent>
                     {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : customers.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {customers.map((customer) => (
                                <div key={customer.id} className="group relative flex flex-col items-center gap-2 p-2 border rounded-lg">
                                    <div className="relative w-full h-20 bg-muted rounded-md flex items-center justify-center">
                                        <Image
                                            src={customer.logoUrl}
                                            alt={customer.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-center truncate w-full">{customer.name}</p>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDelete(customer.id)}
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">Ingen kunder tilføjet endnu.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Tilføj Ny Kunde</CardTitle>
                    <CardDescription>Udfyld felterne for at tilføje et nyt kundelogo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kundenavn</FormLabel>
                                        <FormControl>
                                            <Input placeholder="F.eks. Google" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logo URL</FormLabel>
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
                                            <Input placeholder="F.eks. tech company" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Gem Kunde
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
