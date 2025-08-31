
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
import { saveLead } from '@/services/leads';

const CollectedInfoSchema = z.object({
  name: z.string().nullable().describe("The user's full name."),
  email: z.string().nullable().describe("The user's email address."),
  phone: z.string().nullable().describe("The user's phone number."),
});

const AIProjectQualificationInputSchema = z.object({
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

const defaultSystemPrompt = `You are an expert AI assistant for Digifly, a digital consulting firm. Your primary goal is to qualify potential client projects by gathering information in a friendly and professional manner. Follow the user's instructions and the output schema carefully.

**Conversation History:**
{{#each conversationHistory}}
**{{role}}:** {{content}}
{{/each}}

**IMPORTANT:** Follow the output schema VERY carefully. Always respond with a complete JSON object that fulfills the schema.`;


const aiProjectQualificationFlow = ai.defineFlow(
  {
    name: 'aiProjectQualificationFlow',
    inputSchema: AIProjectQualificationInputSchema,
    outputSchema: AIProjectQualificationOutputSchema,
  },
  async (input) => {

    const settings = await getGeneralSettings();
    const provider = settings?.aiProvider || 'googleai';
    const model = settings?.aiModel || 'googleai/gemini-1.5-flash';
    
    let systemPrompt: string;
    if (provider === 'openai' && settings?.aiSystemPromptOpenAI) {
        systemPrompt = settings.aiSystemPromptOpenAI;
    } else {
        systemPrompt = settings?.aiSystemPrompt || defaultSystemPrompt;
    }

    const qualificationPrompt = ai.definePrompt({
        name: 'aiProjectQualificationPrompt',
        input: { schema: z.object({ conversationHistory: z.any() }) }, 
        output: { schema: AIProjectQualificationOutputSchema },
        model: model as any,
        prompt: systemPrompt,
        config: {
            // Pass the OpenAI API key if the provider is OpenAI
            ...(provider === 'openai' && process.env.OPENAI_API_KEY && {
                apiKey: process.env.OPENAI_API_KEY
            })
        }
    });
    
    const {output} = await qualificationPrompt({ conversationHistory: input.conversationHistory });

    if (!output) {
      throw new Error('No output from prompt');
    }

    // When the conversation is complete and qualified, save the lead
    if (output.qualified && output.shouldBookMeeting && output.collectedInfo) {
        await saveLead({
            name: output.collectedInfo.name || 'N/A',
            email: output.collectedInfo.email || 'N/A',
            phone: output.collectedInfo.phone || 'N/A',
            projectIdea: JSON.stringify(input.conversationHistory), // Store convo for context
            status: 'Qualified',
            createdAt: new Date(),
        });
    }

    return output;
  }
);

