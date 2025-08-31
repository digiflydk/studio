import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import OpenAI from 'openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    // The OpenAI plugin will automatically use the OPENAI_API_KEY environment variable.
    new OpenAI(),
  ],
});
