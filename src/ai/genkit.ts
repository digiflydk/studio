import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from 'openai';

export const ai = genkit({
  plugins: [
    googleAI(),
    // The OpenAI plugin will automatically use the OPENAI_API_KEY environment variable.
    openAI(),
  ],
});
