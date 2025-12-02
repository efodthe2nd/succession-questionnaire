export type QuestionType = 'text' | 'textarea' | 'select' | 'dropdown' | 'voice';

export interface Question {
  id: string;
  section: string;
  text: string;
  type: QuestionType;
  required: boolean;
  voiceEnabled?: boolean;
  options?: string[]; // For dropdowns
}

export const questions: Question[] = [
  // YOU FILL THIS IN - Example:
  {
    id: 'q1',
    section: 'Personal Background',
    text: 'What is your full name?',
    type: 'text',
    required: true,
  },
  {
    id: 'q2',
    section: 'Personal Background',
    text: 'Tell us about your childhood.',
    type: 'textarea',
    required: true,
    voiceEnabled: true,
  },
  {
    id: 'q3',
    section: 'Family History',
    text: 'Marital status?',
    type: 'dropdown',
    required: true,
    options: ['Single', 'Married', 'Divorced', 'Widowed'],
  },
  // ... ADD ALL 50 QUESTIONS
];
