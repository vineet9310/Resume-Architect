'use client';

import { cn } from '@/lib/utils';
import type { ResumeLayout } from '@/lib/types';

interface TemplateSelectorProps {
  currentLayout: ResumeLayout;
  onLayoutChange: (newLayout: ResumeLayout) => void;
}

// --- Preview Components ---

const ModernTemplatePreview = () => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-md p-2 flex flex-col gap-2 scale-[1.7] sm:scale-100">
    <div className="bg-primary/20 h-5 rounded-sm" />
    <div className="space-y-1">
      <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
     <div className="space-y-1 pt-1">
      <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
    <div className="space-y-1 pt-1">
      <div className="bg-primary/80 h-2 w-1/4 rounded-sm" />
       <div className="flex flex-wrap gap-1 mt-1">
        <div className="bg-primary/20 h-2 w-6 rounded-full" />
        <div className="bg-primary/20 h-2 w-8 rounded-full" />
        <div className="bg-primary/20 h-2 w-5 rounded-full" />
      </div>
    </div>
  </div>
);

const CreativeTemplatePreview = () => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-md flex scale-[1.7] sm:scale-100">
    <div className="w-1/3 bg-secondary/50 p-2 flex flex-col items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-primary/20" />
      <div className="space-y-1 w-full">
        <div className="bg-white h-2 w-full rounded-sm" />
        <div className="bg-gray-300 h-1.5 w-4/5 mx-auto rounded-sm" />
      </div>
      <div className="space-y-1 w-full pt-1">
        <div className="bg-white h-2 w-full rounded-sm" />
        <div className="bg-gray-300 h-1.5 w-4/5 mx-auto rounded-sm" />
      </div>
    </div>
    <div className="w-2/3 p-2 space-y-2">
      <div className="space-y-1">
        <div className="bg-primary/80 h-2 w-1/2 rounded-sm" />
        <div className="bg-gray-300 h-1.5 rounded-sm" />
      </div>
       <div className="space-y-1 pt-1">
        <div className="bg-primary/80 h-2 w-1/2 rounded-sm" />
        <div className="bg-gray-300 h-1.5 rounded-sm" />
        <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
      </div>
    </div>
  </div>
);

const CorporateTemplatePreview = () => (
   <div className="w-full h-full bg-white border border-gray-200 rounded-md p-2 flex flex-col gap-2 scale-[1.7] sm:scale-100">
    <div className="bg-gray-300 h-3 w-1/2 mx-auto rounded-sm" />
    <div className="bg-gray-300 h-1 w-1/3 mx-auto rounded-sm" />
    <div className="bg-secondary/50 h-1 my-1 rounded-sm" />
    <div className="space-y-1">
      <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
     <div className="space-y-1 pt-1">
      <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
  </div>
);

const TwoColumnTemplatePreview = () => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-md p-2 flex flex-col gap-2 scale-[1.7] sm:scale-100">
    <div className="bg-primary/80 h-3 w-1/2 rounded-sm" />
    <div className="bg-gray-300 h-1 w-2/3 rounded-sm" />
    <div className="flex-grow flex gap-2 pt-1">
      <div className="w-2/3 space-y-2">
        <div className="space-y-1">
          <div className="bg-primary/80 h-2 w-1/2 rounded-sm" />
          <div className="bg-gray-300 h-1.5 rounded-sm" />
        </div>
        <div className="space-y-1">
          <div className="bg-primary/80 h-2 w-1/2 rounded-sm" />
          <div className="bg-gray-300 h-1.5 rounded-sm" />
        </div>
      </div>
      <div className="w-1/3 border-l border-gray-200 pl-2 space-y-2">
        <div className="space-y-1">
          <div className="bg-primary/80 h-2 w-full rounded-sm" />
          <div className="bg-gray-300 h-1.5 rounded-sm" />
        </div>
        <div className="space-y-1">
          <div className="bg-primary/80 h-2 w-full rounded-sm" />
          <div className="bg-gray-300 h-1.5 rounded-sm" />
        </div>
      </div>
    </div>
  </div>
);

const MinimalistTemplatePreview = () => (
  <div className="w-full h-full bg-white border border-gray-200 rounded-md p-2 flex flex-col gap-2 scale-[1.7] sm:scale-100">
    <div className="bg-gray-300 h-3 w-1/2 mx-auto rounded-sm" />
    <div className="bg-gray-300 h-1 w-1/3 mx-auto rounded-sm" />
    <div className="space-y-1 pt-2">
      <div className="bg-primary/80 h-2 w-1/4 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
     <div className="space-y-1 pt-2">
      <div className="bg-primary/80 h-2 w-1/4 rounded-sm" />
      <div className="bg-gray-300 h-1.5 rounded-sm" />
      <div className="bg-gray-300 h-1.5 w-5/6 rounded-sm" />
    </div>
  </div>
);

const ArtisticTemplatePreview = () => (
  <div className="w-full h-full bg-secondary/20 border border-gray-200 rounded-md flex flex-col scale-[1.7] sm:scale-100">
    <div className="w-full bg-secondary/50 p-2 flex flex-col items-center gap-1 rounded-t-md">
      <div className="w-1/2 h-3 bg-white rounded-sm" />
      <div className="w-1/3 h-1.5 bg-white/70 rounded-sm" />
    </div>
    <div className="p-2 space-y-2 flex-grow">
      <div className="space-y-1">
        <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
        <div className="bg-gray-300 h-1.5 rounded-sm" />
      </div>
       <div className="space-y-1 pt-1">
        <div className="bg-primary/80 h-2 w-1/3 rounded-sm" />
        <div className="bg-gray-300 h-1.5 rounded-sm" />
      </div>
    </div>
  </div>
);


const layoutOptions: { value: ResumeLayout, label: string, preview: React.ReactNode }[] = [
    { value: 'modern', label: 'Modern', preview: <ModernTemplatePreview /> },
    { value: 'creative', label: 'Creative', preview: <CreativeTemplatePreview /> },
    { value: 'corporate', label: 'Corporate', preview: <CorporateTemplatePreview /> },
    { value: 'two-column', label: 'Two Column', preview: <TwoColumnTemplatePreview /> },
    { value: 'minimalist', label: 'Minimalist', preview: <MinimalistTemplatePreview /> },
    { value: 'artistic', label: 'Artistic', preview: <ArtisticTemplatePreview /> },
]

export default function TemplateSelector({
  currentLayout,
  onLayoutChange,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
      {layoutOptions.map(opt => (
        <div key={opt.value} className="text-center">
            <button
                onClick={() => onLayoutChange(opt.value)}
                className={cn(
                    'w-full rounded-lg border-2 bg-card p-2 transition-all hover:border-primary hover:shadow-lg',
                    currentLayout === opt.value ? 'border-primary shadow-lg' : 'border-transparent'
                )}
            >
                <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted/30 flex items-center justify-center">
                   {opt.preview}
                </div>
            </button>
            <p className="mt-2 text-sm font-semibold">{opt.label}</p>
        </div>
      ))}
    </div>
  );
}
