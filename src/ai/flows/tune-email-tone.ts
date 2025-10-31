'use server';

/**
 * @fileOverview This file defines a Genkit flow for tuning the tone of an email.
 *
 * The flow accepts email content (subject and body) and a desired tone as input.
 * It uses the Gemini model to rewrite the email content to match the specified tone.
 */

import {ai} from '@/ai/genkit';
import { TuneEmailToneInputSchema, TuneEmailToneOutputSchema, type TuneEmailToneInput, type TuneEmailToneOutput } from '@/ai/flows/tune-email-tone.types';


export async function tuneEmailTone(input: TuneEmailToneInput): Promise<TuneEmailToneOutput> {
  return tuneEmailToneFlow(input);
}

const tuneEmailTonePrompt = ai.definePrompt({
  name: 'tuneEmailTonePrompt',
  input: {schema: TuneEmailToneInputSchema},
  output: {schema: TuneEmailToneOutputSchema},
  prompt: `You are an expert email tone adjuster. You will rewrite the provided email content to match the desired tone.

Email Subject: {{{emailContent.subject}}}
Email Body: {{{emailContent.body}}}
Desired Tone: {{{desiredTone}}}

Please provide the rewritten email subject and body in the same format as the input.
`,
});

const tuneEmailToneFlow = ai.defineFlow(
  {
    name: 'tuneEmailToneFlow',
    inputSchema: TuneEmailToneInputSchema,
    outputSchema: TuneEmailToneOutputSchema,
  },
  async input => {
    const {output} = await tuneEmailTonePrompt(input);
    return output!;
  }
);
