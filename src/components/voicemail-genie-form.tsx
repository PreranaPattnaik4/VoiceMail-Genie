"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { runVoiceMailGenieAgent, type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Clipboard,
  Languages,
  Loader2,
  Mic,
  MicOff,
  PenSquare,
  Smile,
  WandSparkles,
} from "lucide-react";

const initialState: FormState = {
  success: false,
  data: null,
  message: null,
};

function SubmitButton() {
  const [pending, setPending] = useState(false);
  
  // A hacky way to get form status pending state until useFormStatus is stable
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const form = document.querySelector('form');
    
    const handleSubmit = () => {
      timeout = setTimeout(() => setPending(true), 0);
    };

    const handleReset = () => {
      clearTimeout(timeout);
      setPending(false);
    }
    
    form?.addEventListener('submit', handleSubmit);
    // We can listen for the form's reset event or a custom event
    form?.addEventListener('reset', handleReset);
    
    return () => {
      form?.removeEventListener('submit', handleSubmit);
      form?.removeEventListener('reset', handleReset);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
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
  );
}


const planIcons: { [key: string]: React.ReactNode } = {
  draft: <PenSquare className="h-5 w-5 text-primary" />,
  tone: <Smile className="h-5 w-5 text-primary" />,
  translate: <Languages className="h-5 w-5 text-primary" />,
  proofread: <CheckCircle className="h-5 w-5 text-primary" />,
};

const getIconForStep = (step: string) => {
  const lowercasedStep = step.toLowerCase();
  if (lowercasedStep.includes("draft")) return planIcons.draft;
  if (lowercasedStep.includes("tone")) return planIcons.tone;
  if (lowercasedStep.includes("translate")) return planIcons.translate;
  if (lowercasedStep.includes("proofread")) return planIcons.proofread;
  return <WandSparkles className="h-5 w-5 text-primary" />;
};

export function VoiceMailGenieForm() {
  const [state, formAction] = useFormState(runVoiceMailGenieAgent, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [goal, setGoal] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const recognitionRef = useRef<any>(null);

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
        console.error("Speech recognition error", event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: event.error,
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        if(recognitionRef.current && isRecording) { // If it stops unexpectedly, restart it.
          try {
            recognition.start();
          } catch(e) {
             // Already started
          }
        }
      };

      recognitionRef.current = recognition;
    } else {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Your browser does not support speech recognition.',
      });
    }
  }, [toast, goal, isRecording]);

  useEffect(() => {
    if (state.message) {
      if (state.success && state.data) {
        setSubject(state.data.subject);
        setBody(state.data.body);
        setIsFinished(true);
      } else if (!state.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: state.message,
        });
      }
    }
    if (state.message || !state.success) {
        formRef.current?.dispatchEvent(new Event('reset'));
    }
  }, [state, toast]);
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        setGoal("");
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  };

  const resetForm = () => {
    setIsFinished(false);
    setSubject("");
    setBody("");
    setGoal("");
    formRef.current?.reset();
    formRef.current?.dispatchEvent(new Event('reset'));
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Mic className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl">VoiceMail Genie</CardTitle>
        <CardDescription className="font-body text-base">
          State your goal in any language. Your Gemini-powered agent handles the rest.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-6">
          {!isFinished ? (
            <div className="space-y-4">
              <div className="grid w-full gap-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="goal" className="font-headline text-lg">Your Goal</Label>
                  <Button type="button" variant="ghost" size="icon" onClick={handleMicClick} className="h-8 w-8">
                    {isRecording ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5 text-primary" />}
                    <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
                  </Button>
                </div>
                <Textarea
                  id="goal"
                  name="goal"
                  placeholder="e.g., Email the client in French to politely ask for the signed documents."
                  className="min-h-[100px] text-base"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
                 {state.message && !state.success && (
                    <p className="text-sm font-medium text-destructive">{state.message}</p>
                  )}
              </div>
              
              {state.success && state.data?.plan && (
                 <div>
                    <Label className="font-headline text-lg">Agent's Plan</Label>
                    <ul className="mt-2 space-y-2">
                        {state.data.plan.map((step, index) => (
                        <li key={index} className="flex items-center gap-3">
                            {getIconForStep(step)}
                            <span className="text-muted-foreground">{step}</span>
                        </li>
                        ))}
                    </ul>
                 </div>
              )}

            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="subject" className="font-headline text-lg">Subject</Label>
                <div className="relative">
                  <Textarea
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="pr-10 text-base"
                  />
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyToClipboard(subject)}>
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="body" className="font-headline text-lg">Body</Label>
                <div className="relative">
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] pr-10 text-base"
                />
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleCopyToClipboard(body)}>
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!isFinished ? (
            <SubmitButton />
          ) : (
            <Button onClick={resetForm} className="w-full" variant="outline">
              <WandSparkles className="mr-2 h-4 w-4" />
              Start a New Email
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
