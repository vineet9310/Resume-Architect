export interface FontOption {
  label: string;
  value: string;
  css: string;
}

export const fontOptions: FontOption[] = [
  { label: 'Modern', value: 'lexend', css: "'Lexend', sans-serif" },
  { label: 'Classic', value: 'poppins', css: "'Poppins', sans-serif" },
  { label: 'Inter', value: 'inter', css: "'Inter', sans-serif" },
  { label: 'Techy', value: 'space-grotesk', css: "'Space Grotesk', sans-serif"},
];

export interface ColorOption {
  name: string;
  headerBg: string;
  headerText: string;
  title: string;
  badgeBg: string;
  badgeText: string;
  link: string;
}

export const colorOptions: ColorOption[] = [
  {
    name: 'Default',
    headerBg: '#2c3e50',
    headerText: '#ffffff',
    title: '#2c3e50',
    badgeBg: '#ecf0f1',
    badgeText: '#2c3e50',
    link: '#3498db'
  },
  {
    name: 'Forest',
    headerBg: '#2d5a3d',
    headerText: '#ffffff',
    title: '#2d5a3d',
    badgeBg: '#e8f5e9',
    badgeText: '#2d5a3d',
    link: '#4caf50'
  },
  {
    name: 'Ocean',
    headerBg: '#0d47a1',
    headerText: '#ffffff',
    title: '#0d47a1',
    badgeBg: '#e3f2fd',
    badgeText: '#0d47a1',
    link: '#1976d2'
  },
  {
    name: 'Crimson',
    headerBg: '#9a0007',
    headerText: '#ffffff',
    title: '#9a0007',
    badgeBg: '#ffebee',
    badgeText: '#9a0007',
    link: '#c62828'
  },
  {
    name: 'Orchid',
    headerBg: '#4a148c',
    headerText: '#ffffff',
    title: '#4a148c',
    badgeBg: '#f3e5f5',
    badgeText: '#4a148c',
    link: '#6a1b9a',
  },
  {
    name: 'Amber',
    headerBg: '#ff6f00',
    headerText: '#ffffff',
    title: '#ff6f00',
    badgeBg: '#fff8e1',
    badgeText: '#ff6f00',
    link: '#ff8f00',
  },
  {
    name: 'Slate',
    headerBg: '#455a64',
    headerText: '#ffffff',
    title: '#455a64',
    badgeBg: '#eceff1',
    badgeText: '#455a64',
    link: '#546e7a',
  },
  {
    name: 'Teal',
    headerBg: '#004d40',
    headerText: '#ffffff',
    title: '#004d40',
    badgeBg: '#e0f2f1',
    badgeText: '#004d40',
    link: '#00695c',
  },
];
