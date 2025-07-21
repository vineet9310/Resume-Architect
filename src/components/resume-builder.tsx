'use client';

import { useState, useEffect, DragEvent } from 'react';
import type { ResumeData, Section } from '@/lib/types';
import { initialResumeData } from '@/lib/initial-resume';
import ResumeHeader from '@/components/resume-header';
import ResumeControls from '@/components/resume-controls';
import ResumePreview from '@/components/resume-preview';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<Section | null>(null);


  useEffect(() => {
    setIsClient(true);
    // You could also load saved data from localStorage here
  }, []);

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const parsedData = JSON.parse(content);
            // Add validation here with Zod if needed
            setResumeData(parsedData);
            toast({
              title: "Success",
              description: "Resume data imported successfully.",
            });
          }
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          toast({
            variant: "destructive",
            title: "Import Error",
            description: "Failed to read or parse the JSON file.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: Section) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetItem: Section) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    const currentIndex = resumeData.sections.findIndex(s => s.id === draggedItem.id);
    const targetIndex = resumeData.sections.findIndex(s => s.id === targetItem.id);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newSections = [...resumeData.sections];
      const [removed] = newSections.splice(currentIndex, 1);
      newSections.splice(targetIndex, 0, removed);
      setResumeData(prev => ({ ...prev, sections: newSections }));
    }

    setDraggedItem(null);
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ResumeHeader resumeData={resumeData} onJsonImport={handleJsonImport} />
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 overflow-auto">
        <aside className="lg:col-span-1 h-full overflow-y-auto pr-4">
          <ResumeControls resumeData={resumeData} setResumeData={setResumeData} />
        </aside>
        <main className="lg:col-span-2 h-full overflow-y-auto">
          <ResumePreview 
            resumeData={resumeData} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
