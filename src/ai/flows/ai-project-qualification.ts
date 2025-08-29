
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
import { saveLead } from '@/services/leads';

const CollectedInfoSchema = z.object({
  name: z.string().optional().describe("The user's full name."),
  email: z.string().optional().describe("The user's email address."),
  phone: z.string().optional().describe("The user's phone number."),
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

const defaultPromptTemplate = `You are an expert AI assistant for Digifly, a digital consulting company. Your primary goal is to qualify potential client projects by gathering information in a friendly and professional manner.

**Conversation Flow Rules:**
1.  **Priority #1: Gather Contact Information.**
    - Start by asking for the user's name.
    - Once you have the name, ask for their email address.
    - Once you have the email, ask for their phone number.
    - DO NOT ask for project details until you have name, email, and phone.

2.  **Priority #2: Qualify the Project.**
    - Only after you have collected all contact information, proceed to ask about the project.
    - You MUST gather information about the following key areas:
        - **Key Features & Goals:** What are the most important features? What is the main goal?
        - **Budget:** What is the approximate budget? (e.g., "< 50.000 DKK", "50.000-150.000 DKK", "> 150.000 DKK").
        - **Timeline:** What is the desired timeline?
    - Ask ONE question at a time.

**Decision Logic & Output Formatting:**
- **If you are missing ANY information (Name, Email, Phone, Features, Budget, or Timeline):**
  - Set \`qualified\` to \`false\`.
  - Formulate the \`nextQuestion\` to get the next piece of missing information.
  - Populate the \`collectedInfo\` object with any information you have gathered so far.
  - Do NOT set \`shouldBookMeeting\`.

- **Once you have ALL required information (Name, Email, Phone, Features, Budget, Timeline):**
  - Analyze the project. If it seems like a good fit (software, AI, automation with a reasonable budget/timeline), set \`qualified\` to \`true\` and \`shouldBookMeeting\` to \`true\`.
  - If it's a clear misfit (e.g., marketing, graphic design), set \`qualified\` to \`false\`.
  - Populate the \`collectedInfo\` object with all gathered information.
  - Do not ask more questions.
`;


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

        **User's Current Message:**
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

    const isComplete = !output.nextQuestion;

    if (isComplete && output.collectedInfo) {
      const fullConversation = [
        ...input.conversationHistory,
        { role: 'user' as const, content: input.projectIdea },
      ];
      const projectDescription = fullConversation.map(m => `${m.role}: ${m.content}`).join('\n');
      
      await saveLead({
        name: output.collectedInfo.name || 'N/A',
        email: output.collectedInfo.email || 'N/A',
        phone: output.collectedInfo.phone || 'N/A',
        projectIdea: projectDescription,
        status: output.qualified ? 'Qualified' : 'Not Qualified',
        createdAt: new Date(),
      });
    }

    return output;
  }
);
