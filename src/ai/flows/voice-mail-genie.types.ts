import {z} from 'genkit';

// Input for the main orchestrator flow
export const VoiceMailGenieInputSchema = z.string().describe('The high-level goal from the user.');
export type VoiceMailGenieInput = z.infer<typeof VoiceMailGenieInputSchema>;

// Output of the main orchestrator flow
export const VoiceMailGenieOutputSchema = z.object({
  subject: z.string(),
  body: z.string(),
  plan: z.array(z.string()),
});
export type VoiceMailGenieOutput = z.infer<typeof VoiceMailGenieOutputSchema>;

// Schema for the planning step's output
export const PlanningSchema = z.object({
  plan: z.array(z.object({
    step: z.string().describe("A human-readable description of the step for the user."),
    tool: z.enum(["draft", "tone", "translate", "proofread"]).describe("The tool to use for this step."),
    args: z.any().describe("The arguments for the tool."),
  })).describe("The multi-step plan to achieve the user's goal."),
  rationale: z.string().describe("A brief explanation of why this plan was chosen."),
});
