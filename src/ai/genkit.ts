import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import OpenAI from 'openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    // The OpenAI plugin is initialized dynamically in the flow
    // new OpenAI(),
  ],
});
