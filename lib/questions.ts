export type QuestionType = 
  | 'text' 
  | 'textarea' 
  | 'dropdown' 
  | 'multiselect' 
  | 'voice';

export interface Question {
  id: string;
  section: string;
  text: string;
  type: QuestionType;
  required: boolean;
  voiceEnabled?: boolean;
  options?: string[];
  placeholder?: string;
  maxLength?: number;
  helpText?: string;
}

export const questions: Question[] = [
  // Section 1: First Things First
  {
    id: 'q1_1',
    section: 'First Things First',
    text: 'Who is this letter to?',
    type: 'dropdown',
    required: true,
    options: [
      'My Loved Ones',
      'My Family and Future Generations',
      'My Beautiful Wife',
      'My Loving Husband',
      'My Children and their Children',
      'Enter Specific Names or Text',
    ],
  },
  {
    id: 'q1_2',
    section: 'First Things First',
    text: 'I am creating this Legacy Letter in order to:',
    type: 'dropdown',
    required: true,
    options: [
      'pass along my values and beliefs.',
      'ensure my family knows my wishes.',
      'share my life lessons and experiences.',
      'leave a meaningful legacy.',
      'share with you my values.',
      'express my love and my hopes for the future.',
      'explain why I distributed my estate the way that I did, and provide guidance on how I think you can make the most of it.',
      "share the wisdom I've gathered, my dreams for what lies ahead, and most importantly, my love for each of you.",
      'ensure that my intentions and priorities are understood and honored.',
      "finally say the things I wasn't able to say to you directly.",
      'Say it in your own words (up to 140 characters)',
    ],
  },
  {
    id: 'q1_3',
    section: 'First Things First',
    text: 'Please share this Legacy Letter with anyone mentioned in it and:',
    type: 'dropdown',
    required: true,
    options: [
      'with my immediate family only.',
      'with my extended family.',
      'with my closest friends.',
      'with any of my family and friends.',
      'with future generations of my family.',
      'as a post on my Facebook Page.',
      'enter Specific Names or Text.',
    ],
  },

  // Section 2: My Values
  {
    id: 'q2_1',
    section: 'My Beliefs and Values',
    text: 'I fundamentally believe:',
    type: 'dropdown',
    required: true,
    options: [
      'that kindness always matters.',
      'that honesty is the best policy.',
      'that family is everything.',
      'in the Golden Rule, do unto others as they would do unto you.',
      'that our faith is God comes first.',
      'that people are inherently good.',
      'that I am a lifelong student.',
      'that everything happens for a reason.',
      'being is much more important than having.',
      'love conquers all.',
      'that I am the architect of my life.',
      'that there is a God and that Jesus Christ is his son and our savior.',
      'that there is one God, who is singular, eternal, and the source of all creation.',
      'that there is one God, Allah, and that Muhammad is his final prophet.',
      'that there is something greater than us out there.',
      'that as Americans, we should be productive.',
      'Enter Text (up to 140 characters)',
    ],
  },

  // Continue with remaining questions...
  // I'll give you the structure, you fill in the rest
];