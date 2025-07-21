'use client';

import { FileDown, FileUp, Download, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiAssistantDialog from './ai-assistant-dialog';
import type { ResumeData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ResumeHeaderProps {
  resumeData: ResumeData;
  onJsonImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumeHeader({ resumeData, onJsonImport }: ResumeHeaderProps) {
  const { toast } = useToast();
  
  const handlePrint = () => {
    window.print();
  };

  const handleJsonExport = () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
       toast({
        title: "Success",
        description: "Resume exported as JSON.",
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Export Error",
        description: "Could not export resume data.",
      });
    }
  };

  const triggerJsonImport = () => {
    document.getElementById('json-import-input')?.click();
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-card shadow-sm print:hidden shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-primary font-headline">
          Resume<span className="text-foreground">Architect</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <AiAssistantDialog />
        
        <Button variant="outline" size="sm" onClick={handleJsonExport}>
          <FileDown /> Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={triggerJsonImport}>
          <FileUp /> Import JSON
        </Button>
        <input type="file" id="json-import-input" className="hidden" accept=".json" onChange={onJsonImport} />

        <Button size="sm" onClick={handlePrint} className="bg-accent hover:bg-accent/90">
          <Download /> Download PDF
        </Button>
      </div>
    </header>
  );
}
