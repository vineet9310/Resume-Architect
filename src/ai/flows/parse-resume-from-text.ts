'use server';

/**
 * @fileOverview Resume parser AI agent.
 * Yeh file ek AI agent ko define karti hai jo raw text se resume data extract karta hai.
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
  gpa: z.string().optional(),
});

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.string(),
  link: z.string().optional(),
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
  visible: z.boolean(),
  content: z.union([
    z.string(),
    z.array(ExperienceSchema),
    z.array(EducationSchema),
    z.array(ProjectSchema),
    z.array(CertificationSchema),
  ]),
});

// Output schema: Hamare ResumeData type se match karega.
const ParseResumeOutputSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe("User ka poora naam."),
    email: z.string().describe("User ka email address."),
    phone: z.string().describe("User ka phone number."),
    address: z.string().describe("User ka address."),
    linkedin: z.string().optional().describe("LinkedIn profile URL."),
    github: z.string().optional().describe("GitHub profile URL."),
  }),
  sections: z.array(SectionSchema),
});


export async function parseResumeFromText(resumeText: string): Promise<ResumeData> {
  const parsedData = await parseResumeFlow({ resumeText });

  // AI se mile data ko hamare app ke format mein transform karenge.
  return {
    ...parsedData,
    personalInfo: {
        ...parsedData.personalInfo,
        // Optional fields ke liye fallback
        linkedin: parsedData.personalInfo.linkedin || '',
        github: parsedData.personalInfo.github || '',
    },
    theme: { color: 'default', font: 'lexend' }, // Default theme
    layout: 'modern', // Default layout
  };
}

const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: z.object({ resumeText: z.string() }),
    outputSchema: ParseResumeOutputSchema,
  },
  async ({ resumeText }) => {
    const prompt = `Aap ek expert resume parser hain. Diye gaye text se resume ke alag-alag sections (Personal Info, Professional Summary, Work Experience, Education, Skills, Projects, Certifications, Languages) ko pehchane aur unhe neeche diye gaye JSON format mein structure karein. Har section ke liye ek unique 'id' generate karein.

Resume Text:
${resumeText}

Kripya is text ko JSON format mein output karein jo is schema se match karta ho. Har experience, education, project, aur certification item ke liye ek unique 'id' zaroor banayein. Jaise 'exp1', 'edu1', etc. Sabhi sections ko 'visible: true' ke saath set karein.`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      output: {
        format: 'json',
        schema: zodToJsonSchema(ParseResumeOutputSchema),
      },
    });
    
    const output = llmResponse.output();
    if (!output) {
        throw new Error("AI se koi response nahi mila.");
    }
    return output;
  }
);
