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
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});
export type AIProjectQualificationOutput = z.infer<typeof AIProjectQualificationOutputSchema>;

export async function aiProjectQualification(input: AIProjectQualificationInput): Promise<AIProjectQualificationOutput> {
  return aiProjectQualificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProjectQualificationPrompt',
  input: {schema: AIProjectQualificationInputSchema},
  output: {schema: AIProjectQualificationOutputSchema},
  prompt: `You are an AI assistant helping to qualify project ideas for Digifly, a consulting company. Your goal is to ask clarifying questions to determine if the project is a good fit for Digifly's expertise. Act like a helpful assistant who wants to help the user.

  Here's the user's initial project idea: {{{projectIdea}}}

  Here's the conversation history so far:
  {{#each conversationHistory}}
  {{#if (eq role \"user\")}}
  User: {{{content}}}
  {{else}}
  Assistant: {{{content}}}
  {{/if}}
  {{/each}}

  Based on the project idea and conversation history, determine:

  1.  If you have enough information to qualify the project. If not, set qualified to false, formulate one clarifying question to learn more about the project, and set it as nextQuestion. The nextQuestion should be concise and easy to answer.
  2.  If you have enough information and the project seems like a good fit for Digifly, set qualified to true and set shouldBookMeeting to true.
  3.  If you have enough information and the project doesn't seem like a good fit, set qualified to false and do not set shouldBookMeeting.

  Include the full conversation history in the output, adding your new response to it.
  Follow the schema instructions closely for formatting the output.
  `,
});

const aiProjectQualificationFlow = ai.defineFlow(
  {
    name: 'aiProjectQualificationFlow',
    inputSchema: AIProjectQualificationInputSchema,
    outputSchema: AIProjectQualificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output) {
      throw new Error('No output from prompt');
    }

    const conversationHistory = [
      ...input.conversationHistory ?? [],
      { role: 'user', content: input.projectIdea },
      { role: 'assistant', content: output.nextQuestion || (output.shouldBookMeeting ? 'Great, book a meeting!' : 'This does not sound like a good fit')},
    ];

    return {
      ...output,
      conversationHistory,
    };
  }
);
