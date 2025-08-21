'use client';

import type { ResumeData, Section } from '@/lib/types';
import { DragEvent } from 'react';
import ModernTemplate from './resume-templates/modern-template';
import CreativeTemplate from './resume-templates/creative-template';
import CorporateTemplate from './resume-templates/corporate-template';
import TwoColumnTemplate from './resume-templates/two-column-template';
import MinimalistTemplate from './resume-templates/minimalist-template';
import ArtisticTemplate from './resume-templates/artistic-template';

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDragStart: (e: DragEvent<HTMLDivElement>, item: Section) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, targetItem: Section) => void;
}

export default function ResumePreview({ resumeData, onDragStart, onDragOver, onDrop }: ResumePreviewProps) {
  const { layout } = resumeData;

  const renderTemplate = () => {
    switch(layout) {
      case 'creative':
        return <CreativeTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
      case 'corporate':
        return <CorporateTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
      case 'two-column':
        return <TwoColumnTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
      case 'minimalist':
        return <MinimalistTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
      case 'artistic':
        return <ArtisticTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
      case 'modern':
      default:
        return <ModernTemplate {...{ resumeData, onDragStart, onDragOver, onDrop }} />;
    }
  }

  return (
    <div id="resume-container" className="lg:sticky top-24">
       <div className="w-full max-w-[210mm] mx-auto scale-[0.9] sm:scale-100 origin-top">
         {renderTemplate()}
       </div>
    </div>
  );
}
