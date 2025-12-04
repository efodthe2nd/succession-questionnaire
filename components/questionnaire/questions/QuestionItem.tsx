'use client';

import { Question } from '@/lib/questions';
import QuestionInput from './QuestionInput';

interface QuestionItemProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  isDarkMode: boolean;
}

export default function QuestionItem({ question, value, onChange, isDarkMode }: QuestionItemProps) {
  return (
    <div className="space-y-3">
      {/* Question text */}
      <div>
        <p className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {question.text}
        </p>
        {question.label && (
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
