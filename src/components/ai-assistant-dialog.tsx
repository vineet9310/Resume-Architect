'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { improveResumeWriting } from '@/ai/flows/improve-resume-writing';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AiAssistantDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImproveText = async () => {
    if (!inputText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please paste some text to improve.',
      });
      return;
    }
    setIsLoading(true);
    setImprovedText('');
    try {
      const result = await improveResumeWriting({ resumeContent: inputText });
      setImprovedText(result.improvedResumeContent);
    } catch (error) {
      console.error('AI assistant error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get suggestion from AI assistant.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(improvedText);
    toast({
      title: 'Copied!',
      description: 'Improved text copied to clipboard.',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4 text-accent" /> AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" /> AI Writing Assistant
          </DialogTitle>
          <DialogDescription>
            Paste any part of your resume (like a summary or job description) and let our AI improve it for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Your Text</h3>
            <Textarea
              placeholder="Paste your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={10}
              className="h-full"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">AI Suggestion</h3>
            <div className="relative h-full">
              <Textarea
                placeholder="AI suggestion will appear here..."
                value={improvedText}
                readOnly
                rows={10}
                className="bg-muted h-full"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          {improvedText && (
            <Button variant="secondary" onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
          )}
          <Button onClick={handleImproveText} disabled={isLoading} className="bg-accent hover:bg-accent/90">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Improving...</> : 'Improve Text'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
