
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
import { getGeneralSettings } from '@/services/settings';

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

const defaultPromptTemplate = `You are an expert AI assistant for Digifly, a digital consulting company. Your primary goal is to qualify potential client projects by asking clarifying questions in a friendly and professional manner.

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


const getPromptTemplate = async () => {
    const settings = await getGeneralSettings();
    return settings?.aiSystemPrompt || defaultPromptTemplate;
}


const aiProjectQualificationFlow = ai.defineFlow(
  {
    name: 'aiProjectQualificationFlow',
    inputSchema: AIProjectQualificationInputSchema,
    outputSchema: AIProjectQualificationOutputSchema,
  },
  async (input) => {
    
    const promptTemplate = await getPromptTemplate();

    const prompt = ai.definePrompt({
      name: 'aiProjectQualificationPrompt',
      input: {schema: AIProjectQualificationInputSchema},
      output: {schema: AIProjectQualificationOutputSchema},
      prompt: `${promptTemplate}

        **User's Initial Idea:**
        {{{projectIdea}}}

        **Conversation History:**
        {{#each conversationHistory}}
        {{#if (eq role "user")}}
        User: {{{content}}}
        {{else}}
        Assistant: {{{content}}}
        {{/if}}
        {{/each}}

        Follow the schema instructions closely for formatting the output.
      `,
    });

    const {output} = await prompt(input);

    if (!output) {
      throw new Error('No output from prompt');
    }

    const newAssistantMessage = output.nextQuestion 
        ? output.nextQuestion 
        : output.shouldBookMeeting 
            ? 'Great, based on your answers, it seems like we could be a good fit. Please book a meeting with us.' 
            : 'Thank you for the information. Based on what you\'ve told me, it doesn\'t look like we are the right fit for this project.';

    const conversationHistory = [
      ...input.conversationHistory ?? [],
      { role: 'user', content: input.projectIdea },
      { role: 'assistant', content: newAssistantMessage },
    ];

    return {
      ...output,
      conversationHistory,
    };
  }
);
