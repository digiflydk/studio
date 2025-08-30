
'use server';

/**
 * @fileOverview A flow for qualifying project ideas using AI.
 *
 * - aiProjectQualification - A function that initiates the AI project qualification process.
 * - AIProjectQualificationInput - The input type for the aiProjectqualification function.
 * - AIProjectQualificationOutput - The return type for the aiProjectQualification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getGeneralSettings } from '@/services/settings';

const CollectedInfoSchema = z.object({
  name: z.string().nullable().describe("The user's full name."),
  email: z.string().nullable().describe("The user's email address."),
  phone: z.string().nullable().describe("The user's phone number."),
});

const AIProjectQualificationInputSchema = z.object({
  projectIdea: z.string().describe('The initial project idea provided by the user.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
});
export type AIProjectQualificationInput = z.infer<typeof AIProjectQualificationInputSchema>;

const AIProjectQualificationOutputSchema = z.object({
  qualified: z.boolean().describe('Whether the project idea is qualified for a consultation.'),
  nextQuestion: z.string().optional().describe('The next question to ask the user, if qualification is not yet complete.'),
  shouldBookMeeting: z.boolean().optional().describe('Whether to prompt the user to book a meeting with a consultant.'),
  collectedInfo: CollectedInfoSchema.optional().describe('Information collected from the user so far.'),
});
export type AIProjectQualificationOutput = z.infer<typeof AIProjectQualificationOutputSchema>;

export async function aiProjectQualification(input: AIProjectQualificationInput): Promise<AIProjectQualificationOutput> {
  return aiProjectQualificationFlow(input);
}

const defaultSystemPrompt = `Du er en ekspert AI-assistent for Digifly, et digitalt konsulentfirma. Dit primære mål er at kvalificere potentielle klientprojekter ved at indsamle oplysninger på en venlig og professionel måde.

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
  
**Eksisterende samtale:**
{{#each conversationHistory}}
**{{role}}:** {{content}}
{{/each}}

**Brugerens seneste besked:**
{{{projectIdea}}}

**VIGTIGT:** Følg output-skemaet NØJE. Svar altid med et komplet JSON-objekt, der opfylder skemaet.
`;


const aiProjectQualificationFlow = ai.defineFlow(
  {
    name: 'aiProjectQualificationFlow',
    inputSchema: AIProjectQualificationInputSchema,
    outputSchema: AIProjectQualificationOutputSchema,
  },
  async (input) => {

    const settings = await getGeneralSettings();
    const systemPrompt = settings?.aiSystemPrompt || defaultSystemPrompt;
    const model = settings?.aiModel || 'googleai/gemini-1.5-flash';

    const qualificationPrompt = ai.definePrompt({
        name: 'aiProjectQualificationPrompt',
        input: { schema: AIProjectQualificationInputSchema },
        output: { schema: AIProjectQualificationOutputSchema },
        model: model as any, // Cast to any to allow dynamic model names
        prompt: systemPrompt,
    });
    
    const {output} = await qualificationPrompt(input);

    if (!output) {
      throw new Error('No output from prompt');
    }

    return output;
  }
);
