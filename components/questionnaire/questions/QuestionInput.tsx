'use client';

import { Question } from '@/lib/questions';
import TextInput from '../inputs/TextInput';
import TextareaInput from '../inputs/TextareaInput';
import DropdownInput from '../inputs/DropdownInput';
import MultiselectInput from '../inputs/MultiselectInput';
import VoiceInput from '../inputs/VoiceInput';
import MultiDropdownInput from '../inputs/MultiDropdownInput';

interface QuestionInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isDarkMode: boolean;
}

export default function QuestionInput({ question, value, onChange, isDarkMode }: QuestionInputProps) {
  switch (question.type) {
    case 'text':
      return (
        <TextInput
          value={value as string}
          onChange={onChange as (value: string) => void}
          placeholder={question.placeholder}
          isDarkMode={isDarkMode}
        />
      );

    case 'textarea':
      return (
        <TextareaInput
          value={value as string}
          onChange={onChange as (value: string) => void}
          placeholder={question.placeholder}
          isDarkMode={isDarkMode}
        />
      );

    case 'dropdown':
      return (
        <DropdownInput
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          isDarkMode={isDarkMode}
        />
      );

    case 'multiselect':
      return (
        <MultiselectInput
          question={question}
          value={value as string[]}
          onChange={onChange as (value: string[]) => void}
          isDarkMode={isDarkMode}
        />
      );

    case 'voice':
      return (
        <VoiceInput
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          isDarkMode={isDarkMode}
        />
      );

    case 'multi-dropdown':
      return (
        <MultiDropdownInput
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          isDarkMode={isDarkMode}
        />
      );

    default:
      return (
        <TextInput
          value={value as string}
          onChange={onChange as (value: string) => void}
          placeholder={question.placeholder}
          isDarkMode={isDarkMode}
        />
      );
  }
}
