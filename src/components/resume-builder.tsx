'use client';

import { useState, useEffect, DragEvent } from 'react';
import type { ResumeData, Section, ResumeTheme } from '@/lib/types';
import { initialResumeData } from '@/lib/initial-resume';
import ResumeHeader from '@/components/resume-header';
import ResumeControls from '@/components/resume-controls';
import ResumePreview from '@/components/resume-preview';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import ThemeSelector from './theme-selector';
import { fontOptions, colorOptions } from '@/lib/themes';

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<Section | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse resume data from localStorage", e);
        localStorage.removeItem('resumeData');
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
  }, [resumeData, isClient]);


  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const parsedData = JSON.parse(content);
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
  
  const handleThemeChange = (newTheme: Partial<ResumeTheme>) => {
    setResumeData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...newTheme },
    }));
  };

  if (!isClient) {
     return <div className="w-full h-full flex items-center justify-center bg-background"><p>Loading Resume Architect...</p></div>;
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ResumeHeader resumeData={resumeData} onJsonImport={handleJsonImport} />
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-3 gap-4 p-4 overflow-hidden">
        <aside className="xl:col-span-1 h-full flex flex-col gap-4">
          <ThemeSelector 
            currentTheme={resumeData.theme}
            onThemeChange={handleThemeChange}
            fontOptions={fontOptions}
            colorOptions={colorOptions}
          />
          <div className="flex-grow overflow-y-auto pr-2">
            <ResumeControls resumeData={resumeData} setResumeData={setResumeData} />
          </div>
        </aside>
        <main className="xl:col-span-2 h-full overflow-y-auto flex justify-center items-start p-4 bg-secondary/30 rounded-lg">
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
