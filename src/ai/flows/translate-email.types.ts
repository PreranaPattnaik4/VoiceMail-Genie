import {z} from 'genkit';

export const TranslateEmailInputSchema = z.object({
  emailContent: z.object({subject: z.string(), body: z.string()}).describe('The email content to translate, including subject and body.'),
  targetLanguage: z.string().describe('The target language to translate the email into.'),
});
export type TranslateEmailInput = z.infer<typeof TranslateEmailInputSchema>;

export const TranslateEmailOutputSchema = z.object({
  subject: z.string().describe('The translated subject of the email.'),
  body: z.string().describe('The translated body of the email.'),
});
export type TranslateEmailOutput = z.infer<typeof TranslateEmailOutputSchema>;
