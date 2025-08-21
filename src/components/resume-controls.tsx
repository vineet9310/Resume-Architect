'use client';

import { useState, useRef } from 'react';
import type { ResumeData, Section, PersonalInfo, Experience, Education, Project, Certification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, AccordionHeader } from '@/components/ui/accordion';
import { Trash2, PlusCircle, ChevronsUpDown, Sparkles, Loader2, Wand2, Image as ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { improveResumeWriting } from '@/ai/flows/improve-resume-writing';
import { enhanceFullResume } from '@/ai/flows/enhance-full-resume';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from './date-picker';


interface ResumeControlsProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const AiTextarea = ({
  value,
  onChange,
  onImprove,
  ...props
}: React.ComponentProps<typeof Textarea> & { onImprove: (newValue: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImprove = async () => {
    if (!value || typeof value !== 'string' || !value.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Behtar banane ke liye kuch text enter karein.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await improveResumeWriting({ resumeContent: value as string });
      onImprove(result.improvedResumeContent);
    } catch (error) {
      console.error('AI assistant error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'AI assistant se sujhav nahi mil saka.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Textarea value={value} onChange={onChange} {...props} />
      <div className="absolute bottom-2 right-2">
        <Button variant="secondary" size="sm" onClick={handleImprove} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
          )}
          Improve with AI
        </Button>
      </div>
    </div>
  );
};


export default function ResumeControls({ resumeData, setResumeData }: ResumeControlsProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFullEnhance = async () => {
    setIsEnhancing(true);
    try {
      const enhancedData = await enhanceFullResume(resumeData);
      setResumeData(enhancedData);
      toast({
        title: 'Resume Enhanced!',
        description: 'Aapka resume AI ki madad se behtar bana diya gaya hai.',
      });
    } catch (error) {
      console.error('Full resume enhancement error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Poore resume ko enhance karne mein samasya aayi.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            photoUrl: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
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
        return (
          <AiTextarea
            value={section.content}
            onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
            onImprove={(improved) => handleSectionContentChange(section.id, improved)}
            rows={6}
            placeholder="Ek professional summary enter karein..."
            className="text-sm pr-36 pb-10"
          />
        );
      case 'skills':
      case 'languages':
        return (
          <Textarea 
            value={section.content}
            onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
            rows={3}
            placeholder={
              section.type === 'skills' ? "e.g. JavaScript, React, Node.js" :
              section.type === 'languages' ? "e.g. English (Native), Spanish (Conversational)" :
              "Content enter karein..."
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
                      <DatePicker placeholder="Start Date" value={exp.startDate} onChange={value => updateArrayItem(section.id, index, 'startDate', value)} />
                      <DatePicker placeholder="End Date" value={exp.endDate} onChange={value => updateArrayItem(section.id, index, 'endDate', value)} />
                    </div>
                    <AiTextarea 
                      placeholder="Description" 
                      rows={4} 
                      value={exp.description} 
                      onChange={e => updateArrayItem(section.id, index, 'description', e.target.value)}
                      onImprove={(improved) => updateArrayItem(section.id, index, 'description', improved)}
                      className="pr-36 pb-10"
                    />
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
                    <DatePicker placeholder="Graduation Date" value={edu.graduationDate} onChange={value => updateArrayItem(section.id, index, 'graduationDate', value)} />
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
                    <DatePicker placeholder="Date Issued" value={cert.date} onChange={value => updateArrayItem(section.id, index, 'date', value)} />
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
          const newContent = [...(s.content as any[])];
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
          const newContent = (s.content as any[]).filter((_: any, i: number) => i !== index);
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
            return { ...s, content: [...(s.content as any[]), newItem] };
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
          <CardTitle className="font-headline text-base flex justify-between items-center">
            <span>Resume Controls</span>
            <Button size="sm" onClick={handleFullEnhance} disabled={isEnhancing}>
              {isEnhancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Enhance Full Resume
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Yahan se aap apne resume ke har section ko control kar sakte hain.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {resumeData.layout === 'creative' && (
            <div className="space-y-1">
              <Label>Profile Photo</Label>
              <Input 
                ref={fileInputRef}
                type="file" 
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" />
                {resumeData.personalInfo.photoUrl ? "Change Photo" : "Upload Photo"}
              </Button>
              {resumeData.personalInfo.photoUrl && (
                <div className="mt-2 w-24 h-24 rounded-md overflow-hidden bg-muted">
                    <img src={resumeData.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
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
          <Accordion type="multiple" className="w-full space-y-2" defaultValue={['summary']}>
            {resumeData.sections.map(section => (
               section.visible && (
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
               )
            ))}
          </Accordion>
          <div className="mt-4">
              <Select onValueChange={(value: Section['type']) => addSection(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Naya section add karein..." />
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
