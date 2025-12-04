'use client';

import { Question } from '@/lib/questions';
import TextInput from '../inputs/TextInput';
import TextareaInput from '../inputs/TextareaInput';
import DropdownInput from '../inputs/DropdownInput';
import MultiselectInput from '../inputs/MultiselectInput';
import VoiceInput from '../inputs/VoiceInput';
import MultiDropdownInput from '../inputs/MultiDropdownInput';
import StoryInput from '../inputs/StoryInput';
import ChildSectionInput from '../inputs/ChildSectionInput';
import SpouseSectionInput from '../inputs/SpouseSectionInput';

interface QuestionInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isDarkMode: boolean;
  answers?: Record<string, string | string[]>;
  onAddStory?: (questionId: string) => void;
  onAnswerChange?: (questionId: string, value: string | string[]) => void;
}

export default function QuestionInput({
  question,
  value,
  onChange,
  isDarkMode,
  answers,
  onAddStory,
  onAnswerChange,
}: QuestionInputProps) {
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

    case 'story':
      return (
        <StoryInput
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          isDarkMode={isDarkMode}
          answers={answers}
          onAddStory={onAddStory}
          onAnswerChange={onAnswerChange as (questionId: string, value: string) => void}
        />
      );

    case 'child-section':
      return (
        <ChildSectionInput
          question={question}
          isDarkMode={isDarkMode}
          answers={answers || {}}
          onAnswerChange={onAnswerChange as (questionId: string, value: string | string[]) => void}
        />
      );

    case 'spouse-section':
      return (
        <SpouseSectionInput
          question={question}
          isDarkMode={isDarkMode}
          answers={answers || {}}
          onAnswerChange={onAnswerChange as (questionId: string, value: string | string[]) => void}
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
