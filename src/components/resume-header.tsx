'use client';

import { useState } from 'react';
import { FileDown, FileUp, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { ResumeData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ResumeUploader } from './resume-uploader';
import { parseResumeFromText } from '@/ai/flows/parse-resume-from-text';

interface ResumeHeaderProps {
  resumeData: ResumeData;
  onJsonImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadResume: () => void;
  onResumeDataUpdate: (newData: ResumeData) => void; // Changed from onResumeContentUpload
}

export default function ResumeHeader({
  resumeData,
  onJsonImport,
  onUploadResume,
  onResumeDataUpdate
}: ResumeHeaderProps) {
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

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
        description: "Resume JSON format mein export ho gaya.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Resume data export nahi ho saka.",
      });
    }
  };

  const triggerJsonImport = () => {
    document.getElementById('json-import-input')?.click();
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleResumeUpload = async (content: string) => {
    setIsParsing(true);
    try {
      // Use AI to parse the resume content
      const parsedData = await parseResumeFromText(content);
      onResumeDataUpdate(parsedData);
      setShowUploadModal(false);
      toast({
        title: "Success",
        description: "Resume successfully uploaded and parsed!",
      });
    } catch (error) {
      console.error('Resume parsing error:', error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "Failed to process resume content. Please try again.",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm print:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 border-b">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-xl font-bold text-foreground font-headline">
                Resume<span className="text-primary">Architect</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleUploadClick} className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> <span className="hidden sm:inline">Upload Resume</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleJsonExport} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" /> <span className="hidden sm:inline">Export JSON</span>
              </Button>
              <Button variant="outline" size="sm" onClick={triggerJsonImport} className="flex items-center gap-2">
                <FileUp className="h-4 w-4" /> <span className="hidden sm:inline">Import JSON</span>
              </Button>
              <input type="file" id="json-import-input" className="hidden" accept=".json" onChange={onJsonImport} />
              <Button size="sm" onClick={handlePrint} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Upload Resume</DialogTitle>
          <ResumeUploader 
            onUpload={handleResumeUpload}
            isParsing={isParsing}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
