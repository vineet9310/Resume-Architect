'use client';

import { useState, DragEvent } from 'react';
import { UploadCloud, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploaderProps {
  onUpload: (content: string) => void;
  isParsing: boolean;
}

export function ResumeUploader({ onUpload, isParsing }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload TXT, PDF, DOC, or DOCX files only.',
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'File size should be less than 5MB.',
      });
      return;
    }

    setFileName(file.name);

    try {
      let content = '';

      if (file.type === 'text/plain') {
        // Handle text files
        const reader = new FileReader();
        reader.onload = (e) => {
          content = e.target?.result as string;
          onUpload(content);
        };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // Handle PDF files
        try {
          const arrayBuffer = await file.arrayBuffer();
          const response = await fetch('/api/parse-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer,
          });

          if (!response.ok) {
            throw new Error('Failed to parse PDF');
          }

          const result = await response.json();
          onUpload(result.text);
        } catch (error) {
          console.error('PDF parsing error:', error);
          toast({
            variant: 'destructive',
            title: 'PDF Parsing Error',
            description: 'Failed to extract text from PDF. Please try converting to TXT format.',
          });
          setFileName('');
        }
      } else {
        // For DOC/DOCX files - still not supported
        toast({
          variant: 'destructive',
          title: 'Format Not Supported Yet',
          description: 'DOC and DOCX parsing will be added soon. Please use TXT or PDF format for now.',
        });
        setFileName('');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Failed to read file content.',
      });
      setFileName('');
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <label
        htmlFor="input-file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors ${
          dragActive ? 'border-primary' : 'border-muted-foreground/25'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isParsing ? (
            <>
              <Loader2 className="w-10 h-10 mb-3 text-primary animate-spin" />
              <p className="mb-2 text-sm text-muted-foreground">Processing resume...</p>
              <p className="text-xs text-muted-foreground">Please wait</p>
            </>
          ) : fileName ? (
            <>
              <FileText className="w-10 h-10 mb-3 text-primary" />
              <p className="mb-2 text-sm text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">File selected. Click to change.</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">TXT, PDF (Max. 5MB)</p>
            </>
          )}
        </div>
        <input 
          id="input-file-upload" 
          type="file" 
          className="hidden" 
          accept=".txt,.pdf" 
          onChange={handleChange} 
          disabled={isParsing} 
        />
      </label>
      {dragActive && (
        <div 
          className="absolute w-full h-full top-0 left-0" 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
        />
      )}
    </form>
  );
}
