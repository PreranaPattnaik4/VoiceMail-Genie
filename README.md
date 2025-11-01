# VoiceMail Genie

This is a Next.js web application, "VoiceMail Genie," that functions as a sophisticated, AI-powered multilingual email agent.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Next, set up your environment variables. Create a file named `.env` in the root of the project and add your Google Gemini API key:

```
GOOGLE_AI_API_KEY=your_api_key_here
```

Now, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **AI-Powered Email Generation**: Input a high-level goal, and the AI agent will draft a complete email.
- **Multi-language Support**: Request emails in different languages.
- **Tone Adjustment**: Specify a tone (e.g., formal, friendly), and the agent will adapt the writing style.
- **Voice Input**: Use your microphone to dictate your email goal.
- **Share**: Share the generated email via WhatsApp.
- **Download**: Download the email as a `.doc` or `.pdf` file.
