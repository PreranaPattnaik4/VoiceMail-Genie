'use client';

import { useState } from 'react';
import { runVoiceMailGenieAgent, type FormState } from '@/app/actions';
import { InputCard } from '@/components/input-card';
import { OutputCard } from '@/components/output-card';
import { VoiceMailGenieOutput } from '@/ai/flows/voice-mail-genie.types';

const initialState: FormState = {
  success: false,
  data: null,
  message: null,
};

export default function Home() {
  const [inputGoal, setInputGoal] = useState<string>('');
  const [generatedEmail, setGeneratedEmail] = useState<VoiceMailGenieOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    setInputGoal('');
    setGeneratedEmail(null);
    setIsLoading(false);
    setError(null);
  };
  
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedEmail(null);
    
    const formData = new FormData();
    formData.append('goal', inputGoal);
    
    const result = await runVoiceMailGenieAgent(initialState, formData);
    
    if (result.success && result.data) {
        setGeneratedEmail(result.data);
    } else {
        setError(result.message);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 pt-28 gap-8">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="font-headline text-4xl font-bold text-center mb-2">VoiceMail Genie</h1>
        <p className="text-muted-foreground text-center mb-8">State your goal in any language. Your Gemini-powered agent handles the rest.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto items-start">
        <InputCard 
          goal={inputGoal}
          setGoal={setInputGoal}
          onGenerate={handleGenerate}
          onClear={handleClear}
          isLoading={isLoading}
        />
        
        <OutputCard
            isLoading={isLoading}
            error={error}
            generatedEmail={generatedEmail}
            onRetry={handleGenerate}
        />
      </div>
    </div>
  );
}
