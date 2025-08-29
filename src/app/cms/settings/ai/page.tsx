
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
