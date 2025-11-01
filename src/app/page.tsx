'use client';

import { useState, useActionState } from 'react';
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
    <main className="flex min-h-screen w-full flex-col items-center justify-start bg-background p-4 pt-10 gap-8">
      <InputCard 
        goal={inputGoal}
        setGoal={setInputGoal}
        onGenerate={handleGenerate}
        onClear={handleClear}
        isLoading={isLoading}
      />
      
      {(isLoading || generatedEmail || error) && (
        <OutputCard
            isLoading={isLoading}
            error={error}
            generatedEmail={generatedEmail}
            onRetry={handleGenerate}
        />
      )}
    </main>
  );
}
