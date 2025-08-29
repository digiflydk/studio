
'use server';

/**
 * @fileOverview A flow for qualifying project ideas using AI.
 *
 * - aiProjectQualification - A function that initiates the AI project qualification process.
 * - AIProjectQualificationInput - The input type for the aiProjectQualification function.
 * - AIProjectQualificationOutput - The return type for the aiProjectQualification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const qualificationPrompt = ai.definePrompt({
    name: 'aiProjectQualificationPrompt',
    input: { schema: AIProjectQualificationInputSchema },
    output: { schema: AIProjectQualificationOutputSchema },
    model: 'googleai/gemini-1.5-flash',
    prompt: `Du er en ekspert AI-assistent for Digifly, et digitalt konsulentfirma. Dit mål er at kvalificere et projekt baseret på en samtale med brugeren.

**Kvalificeringskriterier:**
- Et projekt er et **godt match**, hvis det handler om softwareudvikling, AI-løsninger, eller automatisering af forretningsprocesser.
- Et projekt er **ikke et match**, hvis det primært handler om marketing, grafisk design, eller andre ydelser Digifly ikke tilbyder.

**Regler for samtale:**
1.  **ALTID Start med uddybende spørgsmål:** Når du modtager brugerens første projektidé, skal du ALTID stille mindst ét uddybende spørgsmål for at forstå målet bedre. Du må IKKE kvalificere eller diskvalificere efter kun én besked fra brugeren.
    - Gode spørgsmål kunne være:
        - "Spændende! Kan du fortælle lidt mere om, hvad hovedformålet med projektet skal være?"
        - "Det lyder interessant. Hvilke funktioner er de vigtigste for dig i første omgang?"
        - "For at forstå det bedre, hvilket problem forsøger projektet at løse for dine brugere?"
2.  **Kvalificér:** Når du har fået svar på dine uddybende spørgsmål og vurderer, at projektet er et **godt match**:
    - Sæt \`qualified\` til \`true\`.
    - Sæt \`shouldBookMeeting\` til \`true\`.
    - Sæt \`nextQuestion\` til: "Tak for informationen! Det lyder som et spændende projekt, vi kan hjælpe med. Book et uforpligtende møde med os nedenfor."
3.  **Diskvalificér:** Når du har fået svar og vurderer, at projektet **ikke er et match**:
    - Sæt \`qualified\` til \`false\`.
    - Sæt \`shouldBookMeeting\` til \`false\`.
    - Sæt \`nextQuestion\` til: "Tak for din henvendelse. Ud fra det oplyste ser det desværre ikke ud til, at vi er det rette match for opgaven. Held og lykke med projektet."
4.  **Fortsæt samtalen:** Hvis du stadig ikke har nok information til at træffe en beslutning (selv efter det første opfølgende spørgsmål), så fortsæt med at stille relevante spørgsmål.
5.  **VIGTIGT:** Ignorer alt andet. Du skal IKKE spørge om navn, e-mail, telefon, budget eller tidslinje. Dit eneste fokus er på selve projektideen.

**Brugerens projektidé:**
{{{projectIdea}}}

**Eksisterende samtale:**
{{#each conversationHistory}}
**{{role}}:** {{content}}
{{/each}}

**VIGTIGT:** Følg output-skemaet NØJE. Svar altid med et komplet JSON-objekt, der opfylder skemaet.
`,
});


const aiProjectQualificationFlow = ai.defineFlow(
  {
    name: 'aiProjectQualificationFlow',
    inputSchema: AIProjectQualificationInputSchema,
    outputSchema: AIProjectQualificationOutputSchema,
  },
  async (input) => {
    
    const {output} = await qualificationPrompt(input);

    if (!output) {
      throw new Error('No output from prompt');
    }

    return output;
  }
);
