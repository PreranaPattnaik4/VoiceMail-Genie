'use server';

import { runVoiceMailGenie } from '@/ai/flows/voice-mail-genie';
import { type VoiceMailGenieOutput } from '@/ai/flows/voice-mail-genie.types';
import { z } from 'zod';

const GoalSchema = z.object({
  goal: z.string().min(10, { message: "Please describe your goal in at least 10 characters." }),
  language: z.string().optional(),
});


export interface FormState {
  success: boolean;
  data: VoiceMailGenieOutput | null;
  message: string | null;
}

export async function runVoiceMailGenieAgent(prevState: FormState, formData: FormData): Promise<FormState> {
  const userGoal = formData.get('goal');
  const language = formData.get('language');
  
  const validatedFields = GoalSchema.safeParse({
    goal: userGoal,
    language: language,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      data: null,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const { goal, language: selectedLanguage } = validatedFields.data;

  let fullGoal = goal;
  if (selectedLanguage && selectedLanguage !== 'auto') {
    fullGoal += ` (in ${selectedLanguage})`;
  }


  try {
    const result = await runVoiceMailGenie(fullGoal);
    return {
      success: true,
      data: result,
      message: 'Email generated successfully.',
    };
  } catch (error) {
    console.error("Error in runVoiceMailGenieAgent:", error);
    // This provides a more generic but safer error message to the client.
    let errorMessage = 'An error occurred while generating the email. Please try again later.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      success: false,
      data: null,
      message: errorMessage,
    };
  }
}
