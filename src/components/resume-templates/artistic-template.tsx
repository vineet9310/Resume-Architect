'use client';

import type { ResumeData, Section, Experience, Education, Project, Certification } from '@/lib/types';
import { Mail, Phone, MapPin, Linkedin, Github, MoveVertical } from 'lucide-react';
import { DragEvent } from 'react';
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

export default function ArtisticTemplate({ resumeData, onDragStart, onDragOver, onDrop }: TemplateProps) {
  const { personalInfo, sections, theme } = resumeData;

  const selectedFont = fontOptions.find(f => f.value === theme.font) || fontOptions[0];
  const selectedColor = colorOptions.find(c => c.name.toLowerCase() === theme.color) || colorOptions[0];

  const themeStyles = {
    fontFamily: selectedFont.css,
    '--primary-color': selectedColor.title,
    '--secondary-color': selectedColor.headerBg,
    '--bg-color': selectedColor.badgeBg,
    color: '#333',
  } as React.CSSProperties;

  const renderSectionContent = (section: Section) => {
    switch (section.type) {
      case 'summary':
        return <p className="text-sm italic">{section.content}</p>;
      case 'experience':
        return (
          <div className="space-y-4">
            {(section.content as Experience[]).map(exp => (
              <div key={exp.id}>
                <h3 className="text-md font-semibold text-[color:var(--primary-color)]">{exp.title}</h3>
                <p className="text-sm font-medium">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                  {exp.description.split('\n').map((item, i) => item.trim() && <li key={i}>{item.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'education':
        return (
          <div className="space-y-3">
            {(section.content as Education[]).map(edu => (
              <div key={edu.id}>
                <h3 className="text-md font-semibold text-[color:var(--primary-color)]">{edu.degree}</h3>
                <p className="text-sm">{edu.institution} | {edu.graduationDate}</p>
              </div>
            ))}
          </div>
        );
      case 'skills':
         return (
            <div className="flex flex-wrap gap-2">
              {(section.content as string).split(',').map(skill => skill.trim()).filter(Boolean).map((skill, i) => (
                <span key={i} className="text-sm px-3 py-1 rounded-full bg-white shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          );
      case 'projects':
        return (
            <div className="space-y-4">
            {(section.content as Project[]).map(proj => (
              <div key={proj.id}>
                 <h3 className="text-md font-semibold text-[color:var(--primary-color)]">{proj.name}</h3>
                 <p className="text-sm mt-1">{proj.description}</p>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{proj.link}</a>}
              </div>
            ))}
          </div>
        );
      case 'certifications':
        return (
            <div className="space-y-3">
            {(section.content as Certification[]).map(cert => (
              <div key={cert.id}>
                <h3 className="text-md font-semibold text-[color:var(--primary-color)]">{cert.name}</h3>
                <p className="text-sm">{cert.issuer} - {cert.date}</p>
              </div>
            ))}
          </div>
        );
      case 'languages':
        return <p className="text-sm">{section.content}</p>;
      default:
        return null;
    }
  }

  return (
    <div id="resume-preview" style={themeStyles} className="bg-[--bg-color] shadow-lg rounded-lg A4-size text-gray-800 transition-all duration-300 flex flex-col">
      <header className="bg-[color:var(--secondary-color)] text-white p-8 text-center rounded-t-lg">
        <h1 className="text-4xl font-bold">{personalInfo.name}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap opacity-80">
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{personalInfo.address}</span>}
        </div>
         <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap opacity-80">
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1.5"><Github className="w-3 h-3"/>{personalInfo.github}</span>}
        </div>
      </header>
      
      <main className="p-8 flex-grow">
        {sections.map(section => (
          section.visible &&
           <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
              <h2 className="text-lg font-bold text-gray-700 border-b-2 border-gray-300 pb-1 mb-3">{section.title}</h2>
              {renderSectionContent(section)}
          </SectionWrapper>
        ))}
      </main>
    </div>
  );
}
