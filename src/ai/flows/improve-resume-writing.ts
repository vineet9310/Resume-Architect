'use server';

/**
 * @fileOverview A resume writing improvement AI agent.
 *
 * - improveResumeWriting - A function that handles the resume writing improvement process.
 * - ImproveResumeWritingInput - The input type for the improveResumeWriting function.
 * - ImproveResumeWritingOutput - The return type for the improveResumeWriting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveResumeWritingInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The content of the resume to be improved.'),
});
export type ImproveResumeWritingInput = z.infer<typeof ImproveResumeWritingInputSchema>;

const ImproveResumeWritingOutputSchema = z.object({
  improvedResumeContent: z
    .string()
    .describe('The improved content of the resume.'),
});
export type ImproveResumeWritingOutput = z.infer<typeof ImproveResumeWritingOutputSchema>;

export async function improveResumeWriting(input: ImproveResumeWritingInput): Promise<ImproveResumeWritingOutput> {
  return improveResumeWritingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveResumeWritingPrompt',
  input: {schema: ImproveResumeWritingInputSchema},
  output: {schema: ImproveResumeWritingOutputSchema},
  prompt: `You are a professional resume writer. You will be given the content of a resume, and you will improve it to enhance readability, clarity, and impact.

Resume Content: {{{resumeContent}}}`,
});

const improveResumeWritingFlow = ai.defineFlow(
  {
    name: 'improveResumeWritingFlow',
    inputSchema: ImproveResumeWritingInputSchema,
    outputSchema: ImproveResumeWritingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
