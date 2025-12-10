'use client';

import { Question } from '@/lib/questions';
import QuestionInput from './QuestionInput';

interface QuestionItemProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isDarkMode: boolean;
  answers?: Record<string, string | string[]>;
  onAddStory?: (questionId: string) => void;
  onAnswerChange?: (questionId: string, value: string | string[]) => void;
}

export default function QuestionItem({
  question,
  value,
  onChange,
  isDarkMode,
  answers,
  onAddStory,
  onAnswerChange,
}: QuestionItemProps) {
  // These types handle their own headline rendering
  if (question.type === 'story' || question.type === 'child-section' || question.type === 'spouse-section') {
    return (
      <QuestionInput
        question={question}
        value={value}
        onChange={onChange}
        isDarkMode={isDarkMode}
        answers={answers}
        onAddStory={onAddStory}
        onAnswerChange={onAnswerChange}
      />
    );
  }

  // Hide labels for "First Things First" section (sectionIndex 1)
  const hideLabel = question.sectionIndex === 1;

  return (
    <div className="space-y-3">
      {/* Question text */}
      <div>
        <p className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {question.text}
        </p>
        {question.label && !hideLabel && (
          <p className="text-[#B5A692] text-sm mt-1">{question.label}</p>
        )}
      </div>

      {/* Input based on type */}
      <QuestionInput
        question={question}
        value={value}
        onChange={onChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
