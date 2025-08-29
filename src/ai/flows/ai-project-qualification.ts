
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
import { saveLead } from '@/services/leads';

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
    model: 'googleai/gemini-2.5-flash',
    prompt: `Du er en ekspert AI-assistent for Digifly, et digitalt konsulentfirma. Dit mål er at kvalificere et projekt baseret på en kort beskrivelse.

**Regler:**
1.  **Analyser projektidéen:** Læs brugerens projektidé.
2.  **Kvalificér:** Hvis projektet handler om software, AI, eller automatisering, er det et godt match.
    - Sæt \`qualified\` til \`true\`.
    - Sæt \`shouldBookMeeting\` til \`true\`.
    - Sæt \`nextQuestion\` til: "Tak for informationen! Det lyder som et spændende projekt, vi kan hjælpe med. Book et uforpligtende møde med os nedenfor."
3.  **Diskvalificér:** Hvis projektet handler om noget andet (f.eks. marketing, grafisk design, etc.), er det IKKE et match.
    - Sæt \`qualified\` til \`false\`.
    - Sæt \`shouldBookMeeting\` til \`false\`.
    - Sæt \`nextQuestion\` til: "Tak for din henvendelse. Ud fra det oplyste ser det desværre ikke ud til, at vi er det rette match for opgaven. Held og lykke med projektet."
4.  **Ignorer alt andet:** Du skal IKKE spørge om navn, e-mail, telefon, budget eller tidslinje. Du skal IKKE forsøge at indsamle oplysninger. Returner kun ét svar baseret på den oprindelige idé.

**Brugerens projektidé:**
{{{projectIdea}}}

**VIGTIGT:** Følg output-skemaet NØJE. Svar altid med et komplet objekt, der opfylder skemaet.
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

