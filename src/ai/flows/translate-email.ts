'use server';
/**
 * @fileOverview A translation AI agent.
 *
 * - translateEmail - A function that handles the translation process.
 */

import {ai} from '@/ai/genkit';
import { TranslateEmailInputSchema, TranslateEmailOutputSchema, type TranslateEmailInput, type TranslateEmailOutput } from '@/ai/flows/translate-email.types';

export async function translateEmail(input: TranslateEmailInput): Promise<TranslateEmailOutput> {
  return translateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateEmailPrompt',
  input: {schema: TranslateEmailInputSchema},
  output: {schema: TranslateEmailOutputSchema},
  prompt: `You are an expert translator specializing in email correspondence.

Translate the following email content into the specified target language.

Target Language: {{{targetLanguage}}}

Subject: {{{emailContent.subject}}}
Body: {{{emailContent.body}}}

Ensure the translated email is clear, concise, and maintains the original intent and tone.`,
});

const translateEmailFlow = ai.defineFlow(
  {
    name: 'translateEmailFlow',
    inputSchema: TranslateEmailInputSchema,
    outputSchema: TranslateEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
