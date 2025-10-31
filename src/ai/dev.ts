import { config } from 'dotenv';
config();

import '@/ai/flows/tune-email-tone.ts';
import '@/ai/flows/generate-email-from-goal.ts';
import '@/ai/flows/translate-email.ts';
import '@/ai/flows/proofread-email.ts';
import '@/ai/flows/voice-mail-genie.ts';
