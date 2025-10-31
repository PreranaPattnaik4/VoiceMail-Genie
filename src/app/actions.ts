'use server';

import { runVoiceMailGenie } from '@/ai/flows/voice-mail-genie';
import { type VoiceMailGenieOutput } from '@/ai/flows/voice-mail-genie.types';
import { z } from 'zod';

const GoalSchema = z.string().min(10, { message: "Please describe your goal in at least 10 characters." });

export interface FormState {
  success: boolean;
  data: VoiceMailGenieOutput | null;
  message: string | null;
}

export async function runVoiceMailGenieAgent(prevState: FormState, formData: FormData): Promise<FormState> {
  const userGoal = formData.get('goal');
  
  const validatedGoal = GoalSchema.safeParse(userGoal);

  if (!validatedGoal.success) {
    return {
      success: false,
      data: null,
      message: validatedGoal.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const result = await runVoiceMailGenie(validatedGoal.data);
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
        // In a real app, you might inspect the error to provide a more specific message
        // For now, we'll keep it general.
    }
    return {
      success: false,
      data: null,
      message: errorMessage,
    };
  }
}
