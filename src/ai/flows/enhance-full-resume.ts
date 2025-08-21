'use server';

/**
 * @fileOverview Full resume enhancement AI agent.
 * Yeh file ek AI agent ko define karti hai jo poore resume ko ek saath enhance karta hai.
 */

import { ai } from '@/ai/genkit';
import { ResumeData } from '@/lib/types';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Har section ke content ke liye specific Zod schemas
const ExperienceSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  graduationDate: z.string(),
  gpa: z.string(),
});

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.string(),
  link: z.string(),
});

const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
});

// z.any() ko ek aakarshit union type se replace kiya gaya hai
const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages']),
  title: z.string(),
  content: z.union([
    z.string(),
    z.array(ExperienceSchema),
    z.array(EducationSchema),
    z.array(ProjectSchema),
    z.array(CertificationSchema),
  ]),
  visible: z.boolean(),
});

// Updated ResumeData schema
const ResumeDataSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    linkedin: z.string(),
    github: z.string(),
  }),
  sections: z.array(SectionSchema),
  theme: z.object({
    color: z.string(),
    font: z.string(),
  }),
  layout: z.string(),
});


export async function enhanceFullResume(resumeData: ResumeData): Promise<ResumeData> {
  const result = await enhanceResumeFlow(resumeData);
  return result;
}

const enhanceResumeFlow = ai.defineFlow(
  {
    name: 'enhanceResumeFlow',
    inputSchema: ResumeDataSchema,
    outputSchema: ResumeDataSchema,
  },
  async (resume) => {
    const prompt = `Aap ek professional resume writer hain. Is resume ke har section (summary, experience descriptions) ko review karein aur use zyada impactful, clear, aur professional banayein. Action verbs ka istemal karein aur achievements ko quantify karein jahan bhi possible ho. Diye gaye JSON structure ko maintain karein.

Resume Data:
${JSON.stringify(resume, null, 2)}
`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      output: {
        format: 'json',
        schema: zodToJsonSchema(ResumeDataSchema),
      },
    });

    const output = llmResponse.output();
    if (!output) {
      throw new Error("AI se koi response nahi mila.");
    }
    
    return output;
  }
);
