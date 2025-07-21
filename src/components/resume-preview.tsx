'use client';

import type { ResumeData, Section, Experience, Education, Project } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin, Github, MoveVertical } from 'lucide-react';
import { DragEvent } from 'react';
import { cn } from '@/lib/utils';
import { fontOptions, colorOptions } from '@/lib/themes';

interface ResumePreviewProps {
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


export default function ResumePreview({ resumeData, onDragStart, onDragOver, onDrop }: ResumePreviewProps) {
  const { personalInfo, sections, theme } = resumeData;

  const selectedFont = fontOptions.find(f => f.value === theme.font) || fontOptions[0];
  const selectedColor = colorOptions.find(c => c.name.toLowerCase() === theme.color) || colorOptions[0];

  const renderSection = (section: Section) => {
    if (!section.visible) return null;
    
    const sectionStyle = {
      '--section-title-color': selectedColor.title,
    } as React.CSSProperties;

    switch (section.type) {
      case 'summary':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 style={sectionStyle} className="text-xl font-bold border-b-2 mb-2 pb-1" >{section.title}</h2>
            <p className="text-sm">{section.content}</p>
          </SectionWrapper>
        );
      case 'experience':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 style={sectionStyle} className="text-xl font-bold border-b-2 mb-3 pb-1">{section.title}</h2>
            {(section.content as Experience[]).map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-sm font-medium text-gray-600">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-md italic text-gray-700">{exp.company}, {exp.location}</p>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1 marker:text-[color:var(--section-title-color)]">
                  {exp.description.split('\n').map((item, i) => item.trim() && <li key={i}>{item.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </SectionWrapper>
        );
      case 'education':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 style={sectionStyle} className="text-xl font-bold border-b-2 mb-3 pb-1">{section.title}</h2>
            {(section.content as Education[]).map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{edu.institution}</h3>
                  <p className="text-sm font-medium text-gray-600">{edu.graduationDate}</p>
                </div>
                <p className="text-md italic">{edu.degree}</p>
                {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </SectionWrapper>
        );
      case 'skills':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 style={sectionStyle} className="text-xl font-bold border-b-2 mb-2 pb-1">{section.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {(section.content as string).split(',').map(skill => skill.trim()).filter(Boolean).map((skill, i) => (
                <span key={i} className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: selectedColor.badgeBg, color: selectedColor.badgeText }}>
                  {skill}
                </span>
              ))}
            </div>
          </SectionWrapper>
        );
      case 'projects':
        return (
          <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
            <h2 style={sectionStyle} className="text-xl font-bold border-b-2 mb-3 pb-1">{section.title}</h2>
            {(section.content as Project[]).map(proj => (
              <div key={proj.id} className="mb-4">
                 <h3 className="text-lg font-semibold">{proj.name}</h3>
                 <p className="text-sm italic text-gray-600">{proj.technologies}</p>
                 <p className="text-sm mt-1">{proj.description}</p>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: selectedColor.link }}>{proj.link}</a>}
              </div>
            ))}
          </SectionWrapper>
        );
      default:
        return null;
    }
  };

  const themeStyles = {
    fontFamily: selectedFont.css,
    '--header-bg-color': selectedColor.headerBg,
    '--header-text-color': selectedColor.headerText,
    '--border-color': selectedColor.title,
    color: '#333', // Default text color for resume body
  } as React.CSSProperties;

  return (
    <div id="resume-preview" style={themeStyles} className="bg-white shadow-lg rounded-lg p-8 A4-size text-gray-800 transition-all duration-300">
      <header className="text-center mb-8 border-b-4 pb-4" style={{ backgroundColor: 'var(--header-bg-color)', color: 'var(--header-text-color)', borderColor: 'var(--border-color)'}}>
        <h1 className="text-4xl font-bold">{personalInfo.name}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap" style={{ color: 'var(--header-text-color)' }}>
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3"/>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3"/>{personalInfo.github}</span>}
        </div>
      </header>

      <main>
        {sections.map(section => renderSection(section))}
      </main>
    </div>
  );
}
