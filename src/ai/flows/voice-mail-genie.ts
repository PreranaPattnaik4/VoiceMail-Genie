'use server';

import { ai } from '@/ai/genkit';
import { generateEmailFromGoal } from './generate-email-from-goal';
import { tuneEmailTone } from './tune-email-tone';
import { translateEmail } from './translate-email';
import { proofreadEmail } from './proofread-email';
import { VoiceMailGenieInputSchema, VoiceMailGenieOutputSchema, PlanningSchema, type VoiceMailGenieInput, type VoiceMailGenieOutput } from './voice-mail-genie.types';
import type { GenerateEmailFromGoalInput } from './generate-email-from-goal.types';
import type { TuneEmailToneInput } from './tune-email-tone.types';
import type { TranslateEmailInput } from './translate-email.types';
import type { ProofreadEmailInput } from './proofread-email.types';

// The planning prompt that instructs the AI to create a plan
const planningPrompt = ai.definePrompt({
  name: 'voiceMailGeniePlanner',
  input: { schema: VoiceMailGenieInputSchema },
  output: { schema: PlanningSchema },
  prompt: `You are an AI agent's brain. Your task is to analyze a user's high-level goal and create a JSON object representing a multi-step plan to generate a perfect email.

You have the following tools available:
- "draft": Creates an initial email draft from a goal. The 'goal' in the arguments should be the original user goal, potentially rephrased for clarity. This should almost always be the first step. Args: { "goal": "string" }.
- "tone": Adjusts the email's tone. Only use this if the user specifies a tone. Args: { "desiredTone": "string (e.g., formal, friendly, professional, concise)" }.
- "translate": Translates the email to another language. Only use if a target language is mentioned. Args: { "targetLanguage": "string (e.g., French, German)" }.
- "proofread": Corrects grammar, spelling, and improves clarity. This should always be the last step to ensure quality. Args: {}.

User Goal: "{{{$input}}}"

Analyze the user's goal and generate a logical sequence of steps. For "Email my manager to thank them for the meeting in a formal tone," the plan should be [draft, tone, proofread]. For "send an email in Spanish to a client about a deadline extension", the plan should be [draft, translate, proofread]. For "write a quick note to my team about the new update", the plan is just [draft, proofread].

Provide your response in the specified JSON format. The 'step' should be a user-friendly string like "Drafting initial email", "Translating to Spanish", or "Adjusting tone to be more formal".
`,
});

// The main flow
export const voiceMailGenieFlow = ai.defineFlow(
  {
    name: 'voiceMailGenieFlow',
    inputSchema: VoiceMailGenieInputSchema,
    outputSchema: VoiceMailGenieOutputSchema,
  },
  async (goal) => {
    // 1. Planning Step
    const { output: planningOutput } = await planningPrompt(goal);
    if (!planningOutput || !planningOutput.plan || planningOutput.plan.length === 0) {
      throw new Error("Could not generate a plan from the provided goal.");
    }

    const plan = planningOutput.plan;
    const planForUser = plan.map(p => p.step);

    let emailContent = { subject: '', body: '' };

    // 2. Execution Step
    for (const step of plan) {
      try {
        switch (step.tool) {
          case 'draft':
            // The draft tool requires a goal, which might not be in the args if the AI forgets. Default to original goal.
            const draftGoal = step.args?.goal || goal;
            emailContent = await generateEmailFromGoal(draftGoal as GenerateEmailFromGoalInput);
            break;
          case 'tone':
            if (!step.args?.desiredTone) throw new Error("Tone adjustment step is missing the 'desiredTone' argument.");
            emailContent = await tuneEmailTone({
              emailContent,
              desiredTone: step.args.desiredTone,
            } as TuneEmailToneInput);
            break;
          case 'translate':
            if (!step.args?.targetLanguage) throw new Error("Translation step is missing the 'targetLanguage' argument.");
            emailContent = await translateEmail({
              emailContent,
              targetLanguage: step.args.targetLanguage,
            } as TranslateEmailInput);
            break;
          case 'proofread':
            emailContent = await proofreadEmail({ emailContent } as ProofreadEmailInput);
            break;
          default:
            // Optional: Log an unknown tool step
            console.warn(`Unknown tool in plan: ${step.tool}`);
            break;
        }
      } catch (e) {
          throw new Error(`Error executing step "${step.step}": ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    
    return {
      ...emailContent,
      plan: planForUser,
    };
  }
);

export async function runVoiceMailGenie(input: VoiceMailGenieInput): Promise<VoiceMailGenieOutput> {
  return voiceMailGenieFlow(input);
}
