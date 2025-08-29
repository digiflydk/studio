
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Bot, User, CornerDownLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { qualifyProjectAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import type { GeneralSettings } from '@/services/settings';
import type { AIProjectQualificationOutput, AIProjectQualificationInput } from '@/ai/flows/ai-project-qualification';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const defaultGreeting = 'Hej! Jeg er din AI-assistent. Fortæl mig kort om din projektidé, så kan jeg vurdere, om vi er det rette match.';

export default function AiProjectSection({ settings }: { settings: GeneralSettings | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [collectedInfo, setCollectedInfo] = useState<AIProjectQualificationOutput['collectedInfo'] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const greeting = settings?.aiGreetingMessage || defaultGreeting;
    setMessages([{
      role: 'assistant',
      content: greeting
    }])
  }, [settings]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending || isComplete) return;

    const currentUserMessage = input;
    const newMessages: Message[] = [...messages, { role: 'user', content: currentUserMessage }];
    
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
        try {
            const historyForAi: AIProjectQualificationInput['conversationHistory'] = messages.map(msg => ({ role: msg.role, content: msg.content }));

            const response: AIProjectQualificationOutput = await qualifyProjectAction({
                projectIdea: currentUserMessage,
                conversationHistory: historyForAi,
            });

            let allNewMessages = [...newMessages];

            if (response.nextQuestion) {
                allNewMessages.push({ role: 'assistant', content: response.nextQuestion });
            }

            if (response.collectedInfo) {
                setCollectedInfo(response.collectedInfo);
            }

            if (response.shouldBookMeeting) {
                setIsComplete(true);
                if (!response.nextQuestion) {
                allNewMessages.push({
                    role: 'assistant',
                    content:
                    'Tak for informationen! Det lyder som et spændende projekt, vi kan hjælpe med. Book et uforpligtende møde med os nedenfor.',
                });
                }
            } else if (response.qualified === false && !response.nextQuestion) {
                setIsComplete(true);
                allNewMessages.push({
                role: 'assistant',
                content:
                    'Tak for din henvendelse. Ud fra det oplyste ser det desværre ikke ud til, at vi er det rette match for opgaven. Held og lykke med projektet.',
                });
            }
            setMessages(allNewMessages);

        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Der opstod en fejl. Prøv venligst igen senere.' },
            ]);
        }
    });
  };

  const sectionPadding = settings?.sectionPadding?.aiProject;
  const style: React.CSSProperties = sectionPadding ? {
    '--padding-top': `${sectionPadding.top}px`,
    '--padding-bottom': `${sectionPadding.bottom}px`,
    '--padding-top-mobile': `${sectionPadding.topMobile}px`,
    '--padding-bottom-mobile': `${sectionPadding.bottomMobile}px`,
  } as any : {};

  return (
    <section 
        id="ai-project" 
        className="relative w-full bg-gray-900 text-white py-[var(--padding-top-mobile)] md:py-[var(--padding-top)]" 
        style={style}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 opacity-20"></div>
      <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI-drevet Projektkvalificering
                </div>
                <h2 className="text-h2 font-bold tracking-tight text-white">Har du en idé? Lad os validere den sammen.</h2>
                <p className="text-lg text-gray-300">
                    Vores AI-assistent er designet til at forstå din vision. Start en samtale, og lad os sammen afdække potentialet i dit projekt. Det er det første, uforpligtende skridt mod at realisere din idé.
                </p>
            </div>
            
            <Card className="shadow-lg bg-gray-900/60 backdrop-blur-sm border-primary/20">
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                    <div className="max-h-80 overflow-y-auto space-y-6 pr-2">
                        {messages.map((message, index) => (
                        <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                            {message.role === 'assistant' && (
                            <Avatar className="w-8 h-8 border border-primary/50">
                                <AvatarFallback className="bg-gray-800"><Bot className="w-5 h-5 text-primary" /></AvatarFallback>
                            </Avatar>
                            )}
                            <div className={cn('rounded-lg p-3 text-sm break-words', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-800 text-gray-200')}>
                                <p>{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-gray-700 text-gray-300"><User className="w-5 h-5" /></AvatarFallback>
                            </Avatar>
                            )}
                        </div>
                        ))}
                        {isPending && (
                        <div className="flex items-start gap-4 justify-start">
                            <Avatar className="w-8 h-8 border border-primary/50">
                                <AvatarFallback className="bg-gray-800"><Bot className="w-5 h-5 text-primary" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-800 rounded-lg p-3 text-sm">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {isComplete && collectedInfo?.name && (
                        <div className="text-center p-4 border-t border-primary/20">
                        <h3 className="text-xl font-semibold mb-4 text-white">Klar til næste skridt?</h3>
                        <Button asChild size="lg" data-cta="book_meeting_qualified">
                            <Link href="#kontakt">Book Møde Med En Konsulent</Link>
                        </Button>
                        </div>
                    )}

                    {!isComplete && (
                        <form onSubmit={handleSendMessage} className="relative" data-form="project_qualifier">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Beskriv din idé her..."
                            className="pr-20 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:ring-primary"
                            onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                            }}
                        />
                        <Button type="submit" size="icon" className="absolute bottom-3 right-3" disabled={isPending || !input.trim()}>
                            <CornerDownLeft className="h-4 w-4" />
                        </Button>
                        </form>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}

    