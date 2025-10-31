# **App Name**: VoiceMail Genie

## Core Features:

- Goal Input: Accepts user input via text or voice-to-text to define a high-level email goal.
- AI Agent Orchestration: Uses Genkit to orchestrate a multi-step plan for generating the email.
- Plan Display: Displays the AI agent's plan to the user (e.g., 'Detect Intent -> Draft Email -> Adjust Tone').
- Email Drafting: Uses Gemini to generate the initial draft of the email subject and body.
- Tone Tuning Tool: Allows the AI agent to rewrite the email content to match a desired tone using a Gemini-powered tool.
- Translation: Enables the AI agent to translate the email content into a specified target language.
- Output Display and Editing: Presents the final email (Subject and Body) in editable text areas.

## Style Guidelines:

- Primary color: Deep indigo (#4F39EA), evoking intelligence and professionalism.
- Background color: Very light gray (#F4F3F9), providing a clean and focused backdrop.
- Accent color: Violet (#9747FF) for interactive elements and highlights, such as CTAs.
- Headline font: 'Space Grotesk' sans-serif, lending a computerized, techy feel to the headings.
- Body font: 'Inter' sans-serif, for a neutral and modern look. It will be paired with Space Grotesk to ensure optimal readability for the larger text blocks
- Use clear, minimalist icons from 'lucide-react' to represent different agent functions and steps.
- Employ a clean, card-based layout (ShadCN UI Card component) for a structured and easy-to-navigate interface.
- Use subtle loading animations and transitions to indicate processing and provide a smooth user experience.