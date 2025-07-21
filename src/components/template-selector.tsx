
'use client';

import { cn } from '@/lib/utils';
import type { ResumeLayout } from '@/lib/types';
import Image from 'next/image';

interface TemplateSelectorProps {
  currentLayout: ResumeLayout;
  onLayoutChange: (newLayout: ResumeLayout) => void;
}

const layoutOptions: { value: ResumeLayout, label: string, image: string }[] = [
    { value: 'modern', label: 'Modern', image: '/templates/modern.png' },
    { value: 'creative', label: 'Creative', image: '/templates/creative.png' },
    { value: 'corporate', label: 'Corporate', image: '/templates/corporate.png' },
    { value: 'two-column', label: 'Two Column', image: '/templates/two-column.png' },
]

export default function TemplateSelector({
  currentLayout,
  onLayoutChange,
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
      {layoutOptions.map(opt => (
        <div key={opt.value} className="text-center">
            <button
                onClick={() => onLayoutChange(opt.value)}
                className={cn(
                    'w-full rounded-lg border-2 bg-card p-2 transition-all hover:border-primary hover:shadow-lg',
                    currentLayout === opt.value ? 'border-primary shadow-lg' : 'border-transparent'
                )}
            >
                <div className="aspect-[3/4] overflow-hidden rounded-md">
                   <Image 
                    src={opt.image}
                    alt={`${opt.label} template thumbnail`}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover object-top"
                    />
                </div>
            </button>
            <p className="mt-2 text-sm font-semibold">{opt.label}</p>
        </div>
      ))}
    </div>
  );
}
