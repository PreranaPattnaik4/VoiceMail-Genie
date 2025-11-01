
'use client';

import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertCircle,
  Clipboard,
  Download,
  CheckCircle,
  PenSquare,
  Smile,
  Languages,
  WandSparkles,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VoiceMailGenieOutput } from '@/ai/flows/voice-mail-genie.types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';


// WhatsApp icon as an inline SVG
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);


interface OutputCardProps {
  isLoading: boolean;
  error: string | null;
  generatedEmail: VoiceMailGenieOutput | null;
  onRetry: () => void;
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


export function OutputCard({ isLoading, error, generatedEmail, onRetry }: OutputCardProps) {
  const { toast } = useToast();
  const emailContentRef = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = (text: string, type: 'Subject' | 'Body') => {
    navigator.clipboard.writeText(text);
    toast({
        title: `${type} copied to clipboard!`,
    });
  };

  const handleShareWhatsApp = () => {
    if (!generatedEmail) return;
    const text = `Subject: ${generatedEmail.subject}\n\nBody: ${generatedEmail.body}`;
    const encodedText = encodeURIComponent(text);
    window.open(`whatsapp://send?text=${encodedText}`);
  };

  const handleDownloadDocx = () => {
    if (!generatedEmail) return;
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Subject: ",
                            bold: true,
                        }),
                        new TextRun(generatedEmail.subject),
                    ],
                }),
                new Paragraph({
                    children: [new TextRun("")], // Empty line
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Body:",
                            bold: true,
                        }),
                    ],
                }),
                ...generatedEmail.body.split('\n').map(p => new Paragraph({ children: [new TextRun(p)]})),
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "email.docx");
    });
  };
  
  const handleDownloadPdf = () => {
    if (emailContentRef.current) {
        html2canvas(emailContentRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth - 20; // with margin
            const height = width / ratio;

            let position = 10;
            pdf.addImage(imgData, 'PNG', 10, position, width, height);

            pdf.save('email.pdf');
        });
    }
  };


  return (
    <Card className="w-full shadow-lg flex flex-col">
        <CardHeader>
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Generated Email</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-6 min-h-[350px] flex-grow">
            {isLoading ? (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-32 w-full" />
                  </div>
                </div>
            ) : error ? (
                <div className="pt-6">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error || "An unknown error occurred. Please try again."}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={onRetry} className="mt-4 w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </div>
            ) : generatedEmail ? (
                <>
                    <div>
                      <Label className="font-headline text-lg">Agent's Plan</Label>
                      <ul className="mt-2 space-y-2">
                          {generatedEmail.plan.map((step, index) => (
                          <li key={index} className="flex items-center gap-3 text-sm">
                              {getIconForStep(step)}
                              <span className="text-muted-foreground">{step}</span>
                          </li>
                          ))}
                      </ul>
                    </div>
                    <div ref={emailContentRef} className="space-y-4 p-1">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="subject" className="font-headline text-lg">Subject</Label>
                            <div className="relative">
                                <Input
                                    id="subject"
                                    value={generatedEmail.subject}
                                    readOnly
                                    className="pr-10 text-base bg-muted/30"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-1/2 -translate-y-1/2 right-1 h-8 w-8" onClick={() => handleCopyToClipboard(generatedEmail.subject, 'Subject')}>
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="body" className="font-headline text-lg">Body</Label>
                            <div className="relative">
                                <Textarea
                                    id="body"
                                    value={generatedEmail.body}
                                    readOnly
                                    className="min-h-[200px] pr-10 text-base bg-muted/30"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-2 right-1 h-8 w-8" onClick={() => handleCopyToClipboard(generatedEmail.body, 'Body')}>
                                    <Clipboard className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full pt-10">
                    <p className="text-muted-foreground">Your generated email will appear here.</p>
                </div>
            )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="outline" onClick={handleShareWhatsApp} disabled={!generatedEmail}>
                <WhatsAppIcon />
                <span className="ml-2">Share</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button disabled={!generatedEmail}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleDownloadDocx}>Download as .doc</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadPdf}>Download as .pdf</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardFooter>
    </Card>
  );
}
