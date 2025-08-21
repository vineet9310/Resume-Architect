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

export default function MinimalistTemplate({ resumeData, onDragStart, onDragOver, onDrop }: TemplateProps) {
  const { personalInfo, sections, theme } = resumeData;

  const selectedFont = fontOptions.find(f => f.value === theme.font) || fontOptions[0];
  const selectedColor = colorOptions.find(c => c.name.toLowerCase() === theme.color) || colorOptions[0];

  const themeStyles = {
    fontFamily: selectedFont.css,
    '--primary-color': selectedColor.title,
    color: '#333',
  } as React.CSSProperties;

  const renderSectionContent = (section: Section) => {
    switch (section.type) {
      case 'summary':
        return <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>;
      case 'experience':
        return (
          <div className="space-y-5">
            {(section.content as Experience[]).map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-semibold text-gray-800">{exp.title}</h3>
                  <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-sm text-[color:var(--primary-color)] font-medium">{exp.company} | {exp.location}</p>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-gray-600">
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
                <div className="flex justify-between items-baseline">
                  <h3 className="text-md font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-xs text-gray-500">{edu.graduationDate}</p>
                </div>
                <p className="text-sm text-[color:var(--primary-color)] font-medium">{edu.institution}</p>
              </div>
            ))}
          </div>
        );
      case 'skills':
         return <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>;
      case 'projects':
        return (
            <div className="space-y-4">
            {(section.content as Project[]).map(proj => (
              <div key={proj.id}>
                 <h3 className="text-md font-semibold text-gray-800">{proj.name}</h3>
                 <p className="text-sm mt-1 text-gray-600">{proj.description}</p>
                 {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[color:var(--primary-color)] hover:underline">{proj.link}</a>}
              </div>
            ))}
          </div>
        );
      case 'certifications':
        return (
            <div className="space-y-3">
            {(section.content as Certification[]).map(cert => (
              <div key={cert.id}>
                <h3 className="text-md font-semibold text-gray-800">{cert.name} - <span className="text-sm font-normal italic">{cert.issuer}</span></h3>
                <p className="text-xs text-gray-500">{cert.date}</p>
              </div>
            ))}
          </div>
        );
      case 'languages':
        return <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>;
      default:
        return null;
    }
  }

  return (
    <div id="resume-preview" style={themeStyles} className="bg-white shadow-lg rounded-lg p-12 A4-size text-gray-800 transition-all duration-300">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{personalInfo.name}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-3 flex-wrap">
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="flex items-center gap-1.5"><Github className="w-3 h-3"/>{personalInfo.github}</span>}
        </div>
      </header>
      
      <main className="space-y-8">
        {sections.map(section => (
          section.visible &&
           <SectionWrapper key={section.id} section={section} onDragStart={(e) => onDragStart(e, section)} onDragOver={onDragOver} onDrop={(e) => onDrop(e, section)}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary-color)] pb-2 mb-3">{section.title}</h2>
              {renderSectionContent(section)}
          </SectionWrapper>
        ))}
      </main>
    </div>
  );
}
