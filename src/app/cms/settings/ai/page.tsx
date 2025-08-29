
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettings } from '@/services/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2, AlertTriangle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const defaultPrompt = `You are an expert AI assistant for Digifly, a digital consulting company. Your primary goal is to qualify potential client projects by asking clarifying questions in a friendly and professional manner.

**Your Task:**
Based on the user's project idea and the conversation history, your task is to determine if the project is a good fit for Digifly. To do this, you MUST gather information about the following key areas:

1.  **Key Features & Goals:** What are the most important features of the project? What is the main goal the user wants to achieve?
2.  **Budget:** What is the user's approximate budget? (e.g., "< 50.000 DKK", "50.000-150.000 DKK", "> 150.000 DKK").
3.  **Timeline:** What is the desired timeline for the project?

**Conversation Flow Rules:**
- Ask ONE question at a time.
- Analyze the conversation history to see which of the three key areas you still need information about.
- Formulate your next question to cover one of the missing areas. Be concise and easy to understand.

**Decision Logic:**
1.  **If you are missing information** on any of the three key areas (Features, Budget, Timeline), you MUST set \`qualified\` to \`false\` and formulate the \`nextQuestion\` to gather the missing information. Do not set \`shouldBookMeeting\`.
2.  **Once you have answers for all three areas**, and the project seems like a good fit (e.g., involves software development, AI, automation, and has a reasonable budget/timeline), set \`qualified\` to \`true\` and \`shouldBookMeeting\` to \`true\`. Do not ask more questions.
3.  **If you have all the information** and the project is clearly not a fit (e.g., it's about marketing, graphic design, or something outside of Digifly's expertise), set \`qualified\` to \`false\` and do not set \`shouldBookMeeting\`.`;


export default function AiSettingsPage() {
  const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const loadedSettings = await getSettingsAction();
      if (loadedSettings) {
        setSettings({
            aiSystemPrompt: loadedSettings.aiSystemPrompt ?? defaultPrompt,
        });
      } else {
        setSettings({ aiSystemPrompt: defaultPrompt });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleInputChange = (value: string) => {
    setSettings((prev) => ({ ...prev, aiSystemPrompt: value }));
  };

  const handleSaveChanges = () => {
    startSaving(async () => {
      const result = await saveSettingsAction(settings);
      toast({
        title: result.success ? 'Gemt!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold">AI Prompt Indstillinger</h1>
            <p className="text-muted-foreground">Styr AI-assistentens adfærd og personlighed.</p>
        </div>
        <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gem Ændringer
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI System Prompt</CardTitle>
          <CardDescription>
            Dette er den centrale instruktion, der definerer AI-assistentens mål, tone og regler. Juster den for at ændre, hvordan den interagerer med brugerne.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">System Prompt</Label>
            <Textarea
              id="ai-prompt"
              value={settings.aiSystemPrompt || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[400px] font-mono text-xs"
            />
          </div>
           <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Hvordan virker det?</AlertTitle>
              <AlertDescription>
                Hver gang en bruger sender en besked, sender vi hele samtalen sammen med denne prompt til AI'en. Prompten er en instruktion, der tvinger AI'en til at følge dine regler, spørge om de rigtige ting og svare på den måde, du ønsker. Vær specifik for at få de bedste resultater.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
