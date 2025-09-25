/* eslint-disable react/no-unescaped-entities */
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { sendContactMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { GeneralSettings } from '@/types/settings';
import { cn } from '@/lib/utils';


type FormErrors = {
    name?: string[];
    email?: string[];
    message?: string[];
    gdpr?: string[];
}

type FormState = {
  message: string;
  errors?: FormErrors;
};

const initialState: FormState = {
  message: '',
  errors: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending} data-cta="send_contact_message">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Send Message
    </Button>
  );
}

interface ContactSectionProps {
  settings: GeneralSettings | null;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [state, formAction] = useActionState(sendContactMessage, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && (!state.errors || Object.keys(state.errors).length === 0)) {
      toast({
        title: "Message sent!",
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.message && state.errors && Object.keys(state.errors).length > 0) {
        toast({
            title: "Error",
            description: state.message,
            variant: "destructive",
        })
    }
  }, [state, toast]);

  const sectionPadding = settings?.sectionPadding?.contact;
  const style: React.CSSProperties & { [key: string]: string } = {
    '--padding-top-mobile': sectionPadding?.topMobile !== undefined ? `${sectionPadding.topMobile}px` : '48px',
    '--padding-bottom-mobile': sectionPadding?.bottomMobile !== undefined ? `${sectionPadding.bottomMobile}px` : '48px',
    '--padding-top': sectionPadding?.top !== undefined ? `${sectionPadding.top}px` : '96px',
    '--padding-bottom': sectionPadding?.bottom !== undefined ? `${sectionPadding.bottom}px` : '96px',
  };

  if (settings?.contactSectionBackgroundColor) {
    const { h, s, l } = settings.contactSectionBackgroundColor;
    style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
  }

  return (
    <section 
        id="kontakt" 
        className={cn("w-full py-[var(--padding-top-mobile)] md:py-[var(--padding-top)]", !settings?.contactSectionBackgroundColor && "bg-background")}
        style={style}
    >
      <div className="container mx-auto max-w-xl px-4 md:px-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-h2">Get in touch</CardTitle>
            <CardDescription className="mt-4 text-body text-muted-foreground">
              Have a project in mind or just want to say hi? Fill out the form and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <form ref={formRef} action={formAction} data-form="contact">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
                {state?.errors?.name?.[0] && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
                {state?.errors?.email?.[0] && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Tell us a bit about what's on your mind..." required minLength={10} />
                {state?.errors?.message?.[0] && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gdpr" name="gdpr" required />
                <Label htmlFor="gdpr" className="text-sm font-normal text-muted-foreground">
                  I understand that Digifly collects my information in order to contact me.
                </Label>
              </div>
               {state?.errors?.gdpr?.[0] && <p className="text-sm text-destructive">{state.errors.gdpr[0]}</p>}
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
