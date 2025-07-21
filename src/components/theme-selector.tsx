
'use client';

import { Paintbrush, Type, LayoutTemplate } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ResumeTheme, ResumeLayout } from '@/lib/types';
import type { FontOption, ColorOption } from '@/lib/themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ThemeSelectorProps {
  currentTheme: ResumeTheme;
  currentLayout: ResumeLayout;
  onThemeChange: (newTheme: Partial<ResumeTheme>) => void;
  onLayoutChange: (newLayout: ResumeLayout) => void;
  fontOptions: FontOption[];
  colorOptions: ColorOption[];
}

const layoutOptions: { value: ResumeLayout, label: string }[] = [
    { value: 'modern', label: 'Modern' },
    { value: 'creative', label: 'Creative' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'two-column', label: 'Two Column' },
]

export default function ThemeSelector({
  currentTheme,
  currentLayout,
  onThemeChange,
  onLayoutChange,
  fontOptions,
  colorOptions,
}: ThemeSelectorProps) {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-headline">
          <Paintbrush className="w-5 h-5" />
          Customize Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
           <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Layout
          </h4>
          <Select onValueChange={(value: ResumeLayout) => onLayoutChange(value)} defaultValue={currentLayout}>
            <SelectTrigger>
              <SelectValue placeholder="Select a layout" />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Type className="w-4 h-4" /> Font Style
          </h4>
          <div className="flex gap-2">
            {fontOptions.map(font => (
              <Button
                key={font.value}
                variant={currentTheme.font === font.value ? 'default' : 'secondary'}
                size="sm"
                onClick={() => onThemeChange({ font: font.value })}
                className="flex-1"
              >
                {font.label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
             <Paintbrush className="w-4 h-4" /> Color Scheme
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map(color => (
              <button
                key={color.name}
                title={color.name}
                onClick={() => onThemeChange({ color: color.name.toLowerCase() })}
                className={cn(
                  'h-10 w-full rounded-md border-2 transition-all',
                  currentTheme.color === color.name.toLowerCase() ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                )}
                style={{ backgroundColor: color.headerBg }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
