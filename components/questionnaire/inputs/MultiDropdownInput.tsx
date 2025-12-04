'use client';

import { Question } from '@/lib/questions';
import TextInput from './TextInput';

interface MultiDropdownInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

// Placeholder component for future multi-dropdown functionality
// Currently renders as TextInput since multi-dropdown type is not implemented yet
export default function MultiDropdownInput({ question, value, onChange, isDarkMode }: MultiDropdownInputProps) {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={question.placeholder}
      isDarkMode={isDarkMode}
    />
  );
}
