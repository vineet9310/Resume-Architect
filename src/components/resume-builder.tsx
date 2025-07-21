'use client';

import { useState, useEffect, DragEvent } from 'react';
import type { ResumeData, Section, ResumeTheme, ResumeLayout } from '@/lib/types';
import { initialResumeData } from '@/lib/initial-resume';
import ResumeHeader from '@/components/resume-header';
import ResumeControls from '@/components/resume-controls';
import ResumePreview from '@/components/resume-preview';
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
        const parsed = JSON.parse(savedData);
        // Basic validation to prevent loading malformed data
        if (parsed.personalInfo && parsed.sections && parsed.theme) {
          setResumeData(parsed);
        } else {
          localStorage.removeItem('resumeData');
        }
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

  const handleLayoutChange = (newLayout: ResumeLayout) => {
    setResumeData(prev => ({ ...prev, layout: newLayout }));
  }

  if (!isClient) {
     return <div className="w-full h-screen flex items-center justify-center bg-background"><p>Loading Resume Architect...</p></div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <ResumeHeader resumeData={resumeData} onJsonImport={handleJsonImport} />
      <div className="flex-grow grid grid-cols-1 xl:grid-cols-[400px_1fr] overflow-hidden">
        <aside className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto p-4 border-r">
          <ThemeSelector 
            currentTheme={resumeData.theme}
            currentLayout={resumeData.layout}
            onThemeChange={handleThemeChange}
            onLayoutChange={handleLayoutChange}
            fontOptions={fontOptions}
            colorOptions={colorOptions}
          />
          <ResumeControls resumeData={resumeData} setResumeData={setResumeData} />
        </aside>
        <main className="xl:col-span-1 flex justify-center items-start p-8 bg-secondary/30 overflow-y-auto">
          <ResumePreview 
            resumeData={resumeData} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </main>
      </div>
    </div>
  );
}
