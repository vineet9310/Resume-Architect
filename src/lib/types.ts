export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  graduationDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export type Section = {
  id: string;
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects';
  title: string;
  content: any;
  visible: boolean;
};

export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
  theme: {
    color: string;
    font: string;
  };
}
