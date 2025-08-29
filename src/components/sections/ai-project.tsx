
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { qualifyProjectAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiProjectSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isComplete) return;

    const currentUserMessage = input;
    const newMessages: Message[] = [...messages, { role: 'user', content: currentUserMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await qualifyProjectAction({
        projectIdea: currentUserMessage,
        conversationHistory: messages,
      });

      let allNewMessages = [...newMessages];

      if (response.nextQuestion) {
        allNewMessages.push({ role: 'assistant', content: response.nextQuestion });
      }

      if (response.shouldBookMeeting) {
        setIsQualified(true);
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
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Der opstod en fejl. Prøv venligst igen senere.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-project" className="w-full">
      <div className="container mx-auto max-w-xl px-4 md:px-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-h2 font-bold tracking-tight text-black">Fortæl os om dit projekt</CardTitle>
            <CardDescription className="mt-4 text-body text-muted-foreground">
              Vores AI-assistent hjælper med at afklare din idé. Beskriv dit projekt, så stiller vi et par opfølgende spørgsmål.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="pr-4 h-56 overflow-y-auto space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.role === 'assistant' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn('max-w-[75%] rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p>{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4 justify-start">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3 text-sm">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
                 <div ref={messagesEndRef} />
              </div>

              {isQualified && (
                <div className="text-center p-4 border-t">
                  <h3 className="text-xl font-semibold mb-4">Klar til næste skridt?</h3>
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
                    placeholder={messages.length === 0 ? 'Beskriv din projektidé her...' : 'Dit svar...'}
                    className="pr-20 min-h-[60px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <Button type="submit" size="icon" className="absolute bottom-2 right-2" disabled={isLoading || !input.trim()}>
                    <CornerDownLeft className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
