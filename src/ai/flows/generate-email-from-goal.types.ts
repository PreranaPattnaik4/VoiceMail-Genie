import {z} from 'genkit';

export const GenerateEmailFromGoalInputSchema = z.string().describe('The user-provided high-level goal for the email.');
export type GenerateEmailFromGoalInput = z.infer<typeof GenerateEmailFromGoalInputSchema>;

export const GenerateEmailFromGoalOutputSchema = z.object({
  subject: z.string().describe('The generated subject line for the email.'),
  body: z.string().describe('The generated body of the email.'),
});
export type GenerateEmailFromGoalOutput = z.infer<typeof GenerateEmailFromGoalOutputSchema>;
