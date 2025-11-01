
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, MicOff, Trash2, WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InputCardProps {
  goal: string;
  setGoal: (goal: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export function InputCard({ goal, setGoal, onGenerate, onClear, isLoading }: InputCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setGoal(goal + finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: event.error,
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (recognitionRef.current && isRecording) {
          try {
            recognition.start();
          } catch (e) {
            // Already started
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      // This will only show once, which is fine.
      // toast({
      //   variant: 'destructive',
      //   title: 'Unsupported Browser',
      //   description: 'Your browser does not support speech recognition.',
      // });
    }
  }, [toast, goal, isRecording, setGoal]);

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        setGoal('');
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support speech recognition.',
        });
      }
    }
  };

  return (
    <Card className="w-full shadow-lg flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mic className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Your Goal</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="grid w-full gap-1.5 flex-grow">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="icon" onClick={handleMicClick} className="h-8 w-8">
              {isRecording ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5 text-primary" />}
              <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
            </Button>
          </div>
          <Textarea
            id="goal"
            name="goal"
            placeholder="e.g., Email the client in French to politely ask for the signed documents."
            className="min-h-[150px] text-base flex-grow"
            required
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onGenerate} disabled={isLoading || !goal.trim()} className="w-full bg-accent hover:bg-accent/90">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" />
              Generate Email
            </>
          )}
        </Button>
        <Button onClick={onClear} variant="ghost" className="w-full sm:w-auto" disabled={isLoading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
}
