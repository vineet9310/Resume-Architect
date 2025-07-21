'use client';

import { Paintbrush, Type } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ResumeTheme } from '@/lib/types';
import type { FontOption, ColorOption } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: ResumeTheme;
  onThemeChange: (newTheme: Partial<ResumeTheme>) => void;
  fontOptions: FontOption[];
  colorOptions: ColorOption[];
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  fontOptions,
  colorOptions,
}: ThemeSelectorProps) {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-headline">
          <Paintbrush className="w-5 h-5 text-primary" />
          Customize Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
