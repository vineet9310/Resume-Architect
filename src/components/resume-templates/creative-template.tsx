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
    className="mb-6 group relative"
  >
    <div className="absolute -left-8 top-1 h-full items-start hidden group-hover:flex print:hidden">
      <MoveVertical className="w-5 h-5 text-gray-400 cursor-grab" />
    </div>
    {children}
  </div>
);

export default function CreativeTemplate({ resumeData, onDragStart, onDragOver, onDrop }: TemplateProps) {
  const { personalInfo, sections, theme } = resumeData;

  const selectedFont = fontOptions.find(f => f.value === theme.font) || fontOptions[0];
  const selectedColor = colorOptions.find(c => c.name.toLowerCase() === theme.color) || colorOptions[0];

  const themeStyles = {
    fontFamily: selectedFont.css,
    '--primary-color': selectedColor.title,
    '--secondary-color': selectedColor.headerBg,
    color: '#333',
  } as React.CSSProperties;

  const renderSection = (section: Section) => {
    if (!section.visible) return null;

    switch (section.type) {
      case 'summary':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-[color:var(--primary-color)] mb-2">{section.title}</h2>
            <p className="text-sm">{section.content}</p>
          </SectionWrapper>
        );
      case 'experience':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-[color:var(--primary-color)] mb-3">{section.title}</h2>
            {(section.content as Experience[]).map(exp => (
              <div key={exp.id} className="mb-4">
                <h3 className="text-md font-semibold">{exp.title} | {exp.company}</h3>
                <p className="text-xs font-medium text-gray-500">{exp.startDate} - {exp.endDate} | {exp.location}</p>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                  {exp.description.split('\n').map((item, i) => item.trim() && <li key={i}>{item.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </SectionWrapper>
        );
      case 'education':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-[color:var(--primary-color)] mb-3">{section.title}</h2>
            {(section.content as Education[]).map(edu => (
              <div key={edu.id} className="mb-2">
                <h3 className="text-md font-semibold">{edu.degree}</h3>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-xs text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </SectionWrapper>
        );
      case 'skills':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-[color:var(--primary-color)] mb-2">{section.title}</h2>
            <p className="text-sm">{section.content}</p>
          </SectionWrapper>
        );
      case 'projects':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-[color:var(--primary-color)] mb-3">{section.title}</h2>
            {(section.content as Project[]).map(proj => (
              <div key={proj.id} className="mb-4">
                 <h3 className="text-md font-semibold">{proj.name}</h3>
                 <p className="text-sm mt-1">{proj.description}</p>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--primary-color)] hover:underline">{proj.link}</a>}
              </div>
            ))}
          </SectionWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <div id="resume-preview" style={themeStyles} className="bg-white shadow-lg rounded-lg A4-size text-gray-800 transition-all duration-300 flex">
      <aside className="w-1/3 bg-[color:var(--secondary-color)] p-8 text-white">
        <div className="text-center">
            <div
              data-ai-hint="person portrait"
              className="w-32 h-32 rounded-full mx-auto mb-4 bg-cover bg-center"
              style={{ backgroundImage: `url(https://placehold.co/128x128.png)`}}
            ></div>
            <h1 className="text-3xl font-bold">{personalInfo.name}</h1>
        </div>
        
        <div className="mt-8">
            <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-white pb-1 mb-2">Contact</h2>
            <div className="text-sm space-y-2 mt-2">
              {personalInfo.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4"/><span>{personalInfo.email}</span></p>}
              {personalInfo.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4"/><span>{personalInfo.phone}</span></p>}
              {personalInfo.address && <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/><span>{personalInfo.address}</span></p>}
              {personalInfo.linkedin && <p className="flex items-center gap-2"><Linkedin className="w-4 h-4"/><span>{personalInfo.linkedin}</span></p>}
              {personalInfo.github && <p className="flex items-center gap-2"><Github className="w-4 h-4"/><span>{personalInfo.github}</span></p>}
            </div>
        </div>
      </aside>

      <main className="w-2/3 p-8">
        {sections.map(section => renderSection(section))}
      </main>
    </div>
  );
}
