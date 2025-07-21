'use client';

import type { ResumeData, Section, PersonalInfo, Experience, Education, Project, Certification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle, ChevronsUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ResumeControlsProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ResumeControls({ resumeData, setResumeData }: ResumeControlsProps) {

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };
  
  const handleSectionContentChange = (sectionId: string, content: any) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, content } : s),
    }));
  }

  const handleSectionTitleChange = (sectionId: string, title: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, title } : s),
    }));
  };

  const renderSectionControls = (section: Section) => {
    switch(section.type) {
      case 'summary':
      case 'skills':
      case 'languages':
        return (
          <Textarea 
            value={section.content}
            onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
            rows={section.type === 'summary' ? 6 : 3}
            placeholder={
              section.type === 'skills' ? "e.g. JavaScript, React, Node.js" :
              section.type === 'languages' ? "e.g. English (Native), Spanish (Conversational)" :
              "Enter content..."
            }
            className="text-sm"
          />
        );
      case 'experience':
        const experiences = section.content as Experience[];
        return (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <Accordion type="single" collapsible key={exp.id} className="border rounded-md px-2">
                <AccordionItem value={exp.id} className="border-b-0">
                  <AccordionTrigger className="text-sm hover:no-underline">{exp.title || `Experience ${index + 1}`}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Input placeholder="Job Title" value={exp.title} onChange={e => updateArrayItem(section.id, index, 'title', e.target.value)} />
                    <Input placeholder="Company" value={exp.company} onChange={e => updateArrayItem(section.id, index, 'company', e.target.value)} />
                    <Input placeholder="Location" value={exp.location} onChange={e => updateArrayItem(section.id, index, 'location', e.target.value)} />
                    <div className="flex gap-2">
                      <Input placeholder="Start Date" value={exp.startDate} onChange={e => updateArrayItem(section.id, index, 'startDate', e.target.value)} />
                      <Input placeholder="End Date" value={exp.endDate} onChange={e => updateArrayItem(section.id, index, 'endDate', e.target.value)} />
                    </div>
                    <Textarea placeholder="Description" rows={4} value={exp.description} onChange={e => updateArrayItem(section.id, index, 'description', e.target.value)} />
                     <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeArrayItem(section.id, index)}><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id)}><PlusCircle className="w-4 h-4 mr-2" />Add Experience</Button>
          </div>
        );
      case 'education':
        const educations = section.content as Education[];
        return (
           <div className="space-y-4">
            {educations.map((edu, index) => (
              <Accordion type="single" collapsible key={edu.id} className="border rounded-md px-2">
                <AccordionItem value={edu.id} className="border-b-0">
                  <AccordionTrigger className="text-sm hover:no-underline">{edu.degree || `Education ${index + 1}`}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Input placeholder="Degree" value={edu.degree} onChange={e => updateArrayItem(section.id, index, 'degree', e.target.value)} />
                    <Input placeholder="Institution" value={edu.institution} onChange={e => updateArrayItem(section.id, index, 'institution', e.target.value)} />
                    <Input placeholder="Graduation Date" value={edu.graduationDate} onChange={e => updateArrayItem(section.id, index, 'graduationDate', e.target.value)} />
                    <Input placeholder="GPA" value={edu.gpa} onChange={e => updateArrayItem(section.id, index, 'gpa', e.target.value)} />
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeArrayItem(section.id, index)}><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id)}><PlusCircle className="w-4 h-4 mr-2" />Add Education</Button>
          </div>
        )
      case 'projects':
        const projects = section.content as Project[];
        return (
           <div className="space-y-4">
            {projects.map((proj, index) => (
              <Accordion type="single" collapsible key={proj.id} className="border rounded-md px-2">
                <AccordionItem value={proj.id} className="border-b-0">
                  <AccordionTrigger className="text-sm hover:no-underline">{proj.name || `Project ${index + 1}`}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Input placeholder="Project Name" value={proj.name} onChange={e => updateArrayItem(section.id, index, 'name', e.target.value)} />
                    <Textarea placeholder="Description" rows={3} value={proj.description} onChange={e => updateArrayItem(section.id, index, 'description', e.target.value)} />
                    <Input placeholder="Technologies Used" value={proj.technologies} onChange={e => updateArrayItem(section.id, index, 'technologies', e.target.value)} />
                    <Input placeholder="Link" value={proj.link} onChange={e => updateArrayItem(section.id, index, 'link', e.target.value)} />
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeArrayItem(section.id, index)}><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id)}><PlusCircle className="w-4 h-4 mr-2" />Add Project</Button>
          </div>
        )
       case 'certifications':
        const certifications = section.content as Certification[];
        return (
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <Accordion type="single" collapsible key={cert.id} className="border rounded-md px-2">
                <AccordionItem value={cert.id} className="border-b-0">
                  <AccordionTrigger className="text-sm hover:no-underline">{cert.name || `Certification ${index + 1}`}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <Input placeholder="Certification Name" value={cert.name} onChange={e => updateArrayItem(section.id, index, 'name', e.target.value)} />
                    <Input placeholder="Issuing Organization" value={cert.issuer} onChange={e => updateArrayItem(section.id, index, 'issuer', e.target.value)} />
                    <Input placeholder="Date Issued" value={cert.date} onChange={e => updateArrayItem(section.id, index, 'date', e.target.value)} />
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeArrayItem(section.id, index)}><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id)}><PlusCircle className="w-4 h-4 mr-2" />Add Certification</Button>
          </div>
        );
      default:
        return null;
    }
  }

  const updateArrayItem = (sectionId: string, index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newSections = prev.sections.map(s => {
        if (s.id === sectionId) {
          const newContent = [...s.content];
          newContent[index] = { ...newContent[index], [field]: value };
          return { ...s, content: newContent };
        }
        return s;
      });
      return { ...prev, sections: newSections };
    });
  };

  const removeArrayItem = (sectionId: string, index: number) => {
    setResumeData(prev => {
      const newSections = prev.sections.map(s => {
        if (s.id === sectionId) {
          const newContent = s.content.filter((_: any, i: number) => i !== index);
          return { ...s, content: newContent };
        }
        return s;
      });
      return { ...prev, sections: newSections };
    });
  }

  const addArrayItem = (sectionId: string) => {
    setResumeData(prev => {
      const newSections = prev.sections.map(s => {
        if (s.id === sectionId) {
          let newItem;
          const newId = `${sectionId}_${Date.now()}`;
          switch(s.type) {
            case 'experience': newItem = { id: newId, title: '', company: '', location: '', startDate: '', endDate: '', description: '' }; break;
            case 'education': newItem = { id: newId, institution: '', degree: '', graduationDate: '', gpa: '' }; break;
            case 'projects': newItem = { id: newId, name: '', description: '', technologies: '', link: '' }; break;
            case 'certifications': newItem = { id: newId, name: '', issuer: '', date: '' }; break;
            default: newItem = null;
          }
          if(newItem) {
            return { ...s, content: [...s.content, newItem] };
          }
        }
        return s;
      });
      return { ...prev, sections: newSections };
    });
  }

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `${type}_${Date.now()}`,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      visible: true,
      content: ['summary', 'skills', 'languages'].includes(type) ? '' : [],
    };
    if (type === 'experience') newSection.content = [{ id: 'exp_new', title: '', company: '', location: '', startDate: '', endDate: '', description: '' }];
    if (type === 'education') newSection.content = [{ id: 'edu_new', institution: '', degree: '', graduationDate: '', gpa: '' }];
    if (type === 'projects') newSection.content = [{ id: 'proj_new', name: '', description: '', technologies: '', link: '' }];
    if (type === 'certifications') newSection.content = [{ id: 'cert_new', name: '', issuer: '', date: '' }];
    setResumeData(prev => ({...prev, sections: [...prev.sections, newSection]}));
  }

  const removeSection = (sectionId: string) => {
    setResumeData(prev => ({...prev, sections: prev.sections.filter(s => s.id !== sectionId)}));
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
          </div>
           <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
          </div>
           <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalInfoChange} />
          </div>
           <div className="space-y-1">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} />
          </div>
           <div className="space-y-1">
            <Label htmlFor="github">GitHub</Label>
            <Input id="github" name="github" value={resumeData.personalInfo.github} onChange={handlePersonalInfoChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Resume Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-2">
            {resumeData.sections.map(section => (
              <AccordionItem value={section.id} key={section.id} className="border-b-0">
                 <Card className="overflow-hidden">
                    <AccordionHeader className="flex items-center p-2">
                        <AccordionTrigger className="font-semibold hover:no-underline flex-grow p-2 text-sm">
                            <div className="flex items-center gap-2 flex-grow">
                                <ChevronsUpDown className="w-4 h-4 text-muted-foreground cursor-grab" />
                                <Input 
                                    value={section.title}
                                    onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent font-semibold"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </AccordionTrigger>
                        <Button variant="ghost" size="icon" onClick={() => removeSection(section.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AccordionHeader>
                    <AccordionContent className="p-4 pt-0">
                    {renderSectionControls(section)}
                    </AccordionContent>
                 </Card>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-4">
              <Select onValueChange={(value: Section['type']) => addSection(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Add new section..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="skills">Skills</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="certifications">Certifications</SelectItem>
                  <SelectItem value="languages">Languages</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
