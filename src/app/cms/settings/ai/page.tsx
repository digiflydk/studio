
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettings } from '@/services/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const defaultGreeting = 'Hej! Jeg er din AI-assistent. Fortæl mig kort om din projektidé, så kan jeg vurdere, om vi er det rette match.';
const defaultModel = 'googleai/gemini-1.5-flash';

const defaultPrompt = `Du er en ekspert AI-assistent for Digifly, et digitalt konsulentfirma. Dit primære mål er at kvalificere potentielle klientprojekter ved at indsamle oplysninger på en venlig og professionel måde.

**Regler for samtale-flow:**
1.  **Prioritet #1: Indsaml kontaktoplysninger.**
    - Start med at spørge om brugerens fulde navn.
    - Når du har navnet, spørg om deres e-mailadresse.
    - Når du har e-mailen, spørg om deres telefonnummer.
    - Spørg IKKE ind til projektdetaljer, før du har navn, e-mail og telefon.

2.  **Prioritet #2: Kvalificér projektet.**
    - Først efter du har indsamlet alle kontaktoplysninger, fortsæt med at spørge om projektet.
    - Du SKAL indsamle oplysninger om følgende nøgleområder:
        - **Nøglefunktioner & Mål:** Hvad er de vigtigste funktioner? Hvad er det primære mål?
        - **Budget:** Hvad er det omtrentlige budget? (f.eks. "< 50.000 kr.", "50.000-150.000 kr.", "> 150.000 kr.").
        - **Tidslinje:** Hvad er den ønskede tidslinje?
    - Stil ET spørgsmål ad gangen.

**Beslutningslogik & Output-formatering:**
- **Hvis du mangler NOGEN oplysninger (Navn, E-mail, Telefon, Funktioner, Budget, eller Tidslinje):**
  - Sæt \`qualified\` til \`false\`.
  - Formuler \`nextQuestion\` for at få den næste manglende oplysning.
  - Udfyld \`collectedInfo\`-objektet med de oplysninger, du har indsamlet indtil videre.
  - Sæt IKKE \`shouldBookMeeting\`.

- **Når du har ALLE nødvendige oplysninger (Navn, E-mail, Telefon, Funktioner, Budget, Tidslinje):**
  - Analyser projektet. Hvis det virker som et godt match (software, AI, automatisering med et rimeligt budget/tidslinje), sæt \`qualified\` til \`true\` og \`shouldBookMeeting\` til \`true\`.
  - Hvis det er et klart mismatch (f.eks. marketing, grafisk design), sæt \`qualified\` til \`false\`.
  - Udfyld \`collectedInfo\`-objektet med alle indsamlede oplysninger.
  - Stil ikke flere spørgsmål.
`;

const aiModels = [
    { value: 'googleai/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Mest kraftfuld)' },
    { value: 'googleai/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Hurtigst)' },
    { value: 'googleai/gemini-1.5-pro', label: 'Gemini 1.5 Pro (Udgået)' },
    { value: 'googleai/gemini-1.5-flash', label: 'Gemini 1.5 Flash (Udgået)' },
]

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
            aiGreetingMessage: loadedSettings.aiGreetingMessage ?? defaultGreeting,
            aiModel: loadedSettings.aiModel ?? defaultModel,
        });
      } else {
        setSettings({ 
            aiSystemPrompt: defaultPrompt,
            aiGreetingMessage: defaultGreeting,
            aiModel: defaultModel,
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleInputChange = (field: keyof GeneralSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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
          <CardTitle>AI Assistent</CardTitle>
          <CardDescription>
            Styr den indledende besked, AI-model og de overordnede instruktioner for AI-assistenten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-greeting">AI Startbesked</Label>
            <Input
              id="ai-greeting"
              value={settings.aiGreetingMessage || ''}
              onChange={(e) => handleInputChange('aiGreetingMessage', e.target.value)}
              placeholder="Indtast den første besked AI'en skal sende."
            />
            <p className="text-sm text-muted-foreground">Dette er den allerførste besked, brugeren ser i chat-vinduet.</p>
          </div>
          <div className="space-y-2">
             <Label htmlFor="ai-model">AI Model</Label>
             <Select value={settings.aiModel} onValueChange={(value) => handleInputChange('aiModel', value)}>
                <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Vælg en AI model" />
                </SelectTrigger>
                <SelectContent>
                    {aiModels.map(model => (
                        <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
             <p className="text-sm text-muted-foreground">Vælg den AI-model, assistenten skal bruge. Pro er mere avanceret, mens Flash er hurtigere.</p>
          </div>
          <hr />
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">System Prompt</Label>
            <Textarea
              id="ai-prompt"
              value={settings.aiSystemPrompt || ''}
              onChange={(e) => handleInputChange('aiSystemPrompt', e.target.value)}
              className="min-h-[400px] font-mono text-xs"
            />
          </div>
           <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Hvordan virker System Prompten?</AlertTitle>
              <AlertDescription>
                Dette er den centrale instruktion, der definerer AI-assistentens mål, tone og regler. Hver gang en bruger sender en besked, sendes hele samtalen sammen med denne prompt til AI'en. Vær specifik for at få de bedste resultater.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
