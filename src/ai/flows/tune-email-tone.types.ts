import {z} from 'genkit';

export const TuneEmailToneInputSchema = z.object({
  emailContent: z.object({
    subject: z.string().describe('The subject of the email.'),
    body: z.string().describe('The body of the email.'),
  }).describe('The email content to be tuned.'),
  desiredTone: z.string().describe('The desired tone for the email (e.g., formal, informal, friendly).'),
});

export type TuneEmailToneInput = z.infer<typeof TuneEmailToneInputSchema>;

export const TuneEmailToneOutputSchema = z.object({
  subject: z.string().describe('The tuned subject of the email.'),
  body: z.string().describe('The tuned body of the email.'),
});

export type TuneEmailToneOutput = z.infer<typeof TuneEmailToneOutputSchema>;
