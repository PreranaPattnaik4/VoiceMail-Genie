'use server';

import {ai} from '@/ai/genkit';
import { ProofreadEmailInputSchema, ProofreadEmailOutputSchema, type ProofreadEmailInput, type ProofreadEmailOutput } from '@/ai/flows/proofread-email.types';

export async function proofreadEmail(input: ProofreadEmailInput): Promise<ProofreadEmailOutput> {
  return proofreadEmailFlow(input);
}

const proofreadEmailPrompt = ai.definePrompt({
  name: 'proofreadEmailPrompt',
  input: {schema: ProofreadEmailInputSchema},
  output: {schema: ProofreadEmailOutputSchema},
  prompt: `You are an expert proofreader. Correct any grammar, spelling, and punctuation errors in the following email content. Also improve clarity and flow.

Email Subject: {{{emailContent.subject}}}
Email Body: {{{emailContent.body}}}

Return the corrected email content in the specified JSON format.
`,
});

const proofreadEmailFlow = ai.defineFlow(
  {
    name: 'proofreadEmailFlow',
    inputSchema: ProofreadEmailInputSchema,
    outputSchema: ProofreadEmailOutputSchema,
  },
  async (input) => {
    const {output} = await proofreadEmailPrompt(input);
    return output!;
  }
);
