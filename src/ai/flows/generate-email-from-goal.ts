'use server';

/**
 * @fileOverview This file defines a Genkit flow that generates an email draft (subject and body) from a high-level user goal.
 *
 * - generateEmailFromGoal - A function that takes a user's goal and returns an email draft.
 */

import {ai} from '@/ai/genkit';
import { GenerateEmailFromGoalInputSchema, GenerateEmailFromGoalOutputSchema, type GenerateEmailFromGoalInput, type GenerateEmailFromGoalOutput } from '@/ai/flows/generate-email-from-goal.types';

export async function generateEmailFromGoal(input: GenerateEmailFromGoalInput): Promise<GenerateEmailFromGoalOutput> {
  return generateEmailFromGoalFlow(input);
}

const generateEmailPrompt = ai.definePrompt({
  name: 'generateEmailPrompt',
  input: {schema: GenerateEmailFromGoalInputSchema},
  output: {schema: GenerateEmailFromGoalOutputSchema},
  prompt: `You are an AI email assistant. Your task is to generate a draft email (subject and body) based on the user's goal.

User Goal: {{{$input}}}

Email Draft (Subject and Body in JSON format):`,
});

const generateEmailFromGoalFlow = ai.defineFlow(
  {
    name: 'generateEmailFromGoalFlow',
    inputSchema: GenerateEmailFromGoalInputSchema,
    outputSchema: GenerateEmailFromGoalOutputSchema,
  },
  async input => {
    const {output} = await generateEmailPrompt(input);
    return output!;
  }
);
