'use client';

import type { ResumeData, Section, Experience, Education, Project } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin, Github, MoveVertical } from 'lucide-react';
import { DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { fontOptions, colorOptions } from '@/lib/themes';

interface TemplateProps {
  resumeData: ResumeData;
  onDragStart: (e: DragEvent<HTMLDivElement>, item: Section) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, targetItem: Section) => void;
}

const SectionWrapper = ({ section, children, ...props }: { section: Section, children: React.ReactNode } & React.ComponentProps<'div'>) => (
  <div
    {...props}
    draggable
    className="mb-4 group relative"
  >
    <div className="absolute -left-6 top-1 h-full items-start hidden group-hover:flex print:hidden">
      <MoveVertical className="w-4 h-4 text-gray-400 cursor-grab" />
    </div>
    {children}
  </div>
);

export default function CorporateTemplate({ resumeData, onDragStart, onDragOver, onDrop }: TemplateProps) {
  const { personalInfo, sections, theme } = resumeData;

  const selectedFont = fontOptions.find(f => f.value === theme.font) || fontOptions[0];
  const selectedColor = colorOptions.find(c => c.name.toLowerCase() === theme.color) || colorOptions[0];

  const themeStyles = {
    fontFamily: selectedFont.css,
    '--primary-color': selectedColor.title,
    '--secondary-color': selectedColor.headerBg,
    color: '#374151',
  } as React.CSSProperties;

  const renderSection = (section: Section) => {
    if (!section.visible) return null;

    return (
        <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[color:var(--primary-color)] border-b-2 border-[color:var(--primary-color)] pb-1 mb-3">{section.title}</h2>
            {renderSectionContent(section)}
        </SectionWrapper>
    )
  };

  const renderSectionContent = (section: Section) => {
    switch (section.type) {
      case 'summary':
        return <p className="text-sm">{section.content}</p>;
      case 'experience':
        return (
          <div className="space-y-4">
            {(section.content as Experience[]).map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-bold">{exp.title}</h3>
                  <p className="text-xs font-medium">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm italic">{exp.company} | {exp.location}</p>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                  {exp.description.split('\n').map((item, i) => item.trim() && <li key={i}>{item.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-2">
            {(section.content as Education[]).map(edu => (
              <div key={edu.id}>
                 <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-bold">{edu.institution}</h3>
                  <p className="text-xs font-medium">{edu.graduationDate}</p>
                </div>
                <p className="text-sm italic">{edu.degree}</p>
              </div>
            ))}
          </div>
        );
      case 'skills':
         return <p className="text-sm">{section.content}</p>;
      case 'projects':
        return (
            <div className="space-y-3">
            {(section.content as Project[]).map(proj => (
              <div key={proj.id}>
                 <h3 className="text-md font-bold">{proj.name}</h3>
                 <p className="text-sm mt-1">{proj.description}</p>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--primary-color)] hover:underline">{proj.link}</a>}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div id="resume-preview" style={themeStyles} className="bg-white shadow-lg rounded-lg p-10 A4-size text-gray-700 transition-all duration-300">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">{personalInfo.name}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap">
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1.5"><Github className="w-3 h-3"/>{personalInfo.github}</span>}
        </div>
      </header>
      <div className="border-t-4 border-[color:var(--secondary-color)] mb-6"></div>

      <main>
        {sections.map(section => renderSection(section))}
      </main>
    </div>
  );
}
