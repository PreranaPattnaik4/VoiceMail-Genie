import {z} from 'genkit';

export const ProofreadEmailInputSchema = z.object({
  emailContent: z.object({
    subject: z.string().describe('The subject of the email.'),
    body: z.string().describe('The body of the email.'),
  }).describe('The email content to be proofread.'),
});

export type ProofreadEmailInput = z.infer<typeof ProofreadEmailInputSchema>;

export const ProofreadEmailOutputSchema = z.object({
  subject: z.string().describe('The proofread subject of the email.'),
  body: z.string().describe('The proofread body of the email.'),
});

export type ProofreadEmailOutput = z.infer<typeof ProofreadEmailOutputSchema>;
