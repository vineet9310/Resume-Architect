import type { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
  },
  sections: [
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      visible: true,
      content: 'A highly motivated and detail-oriented professional with 5 years of experience in software development. Seeking to leverage my expertise in full-stack development to contribute to your company\'s success.',
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      visible: true,
      content: [
        {
          id: 'exp1',
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Inc.',
          location: 'San Francisco, CA',
          startDate: 'Jan 2021',
          endDate: 'Present',
          description: '- Led a team of 5 engineers in developing and launching a new e-commerce platform.\n- Improved application performance by 30% through code optimization and database tuning.\n- Mentored junior developers and conducted code reviews.',
        },
        {
          id: 'exp2',
          title: 'Software Engineer',
          company: 'Web Innovators',
          location: 'Austin, TX',
          startDate: 'Jun 2018',
          endDate: 'Dec 2020',
          description: '- Developed and maintained front-end features for a SaaS application using React and Redux.\n- Collaborated with UX/UI designers to create intuitive and user-friendly interfaces.\n- Wrote unit and integration tests to ensure code quality.',
        },
      ],
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      visible: true,
      content: [
        {
          id: 'edu1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science in Computer Science',
          graduationDate: 'May 2018',
          gpa: '3.8',
        },
      ],
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      visible: true,
      content: 'JavaScript, TypeScript, React, Node.js, Python, Django, PostgreSQL, Docker, AWS',
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Projects',
      visible: true,
      content: [
        {
          id: 'proj1',
          name: 'Personal Portfolio Website',
          description: 'A responsive website to showcase my projects and skills.',
          technologies: 'Next.js, Tailwind CSS, Vercel',
          link: 'github.com/janedoe/portfolio',
        }
      ]
    },
  ],
  theme: {
    color: 'blue',
    font: 'inter',
  },
};
