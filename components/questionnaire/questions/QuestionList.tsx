'use client';

import { Question } from '@/lib/questions';
import QuestionItem from './QuestionItem';

interface QuestionListProps {
  questions: Question[];
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
  isDarkMode: boolean;
  onAddStory?: (questionId: string) => void;
}

export default function QuestionList({
  questions,
  answers,
  onAnswerChange,
  isDarkMode,
  onAddStory,
}: QuestionListProps) {
  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          value={answers[question.id] || (question.type === 'multiselect' ? [] : '')}
          onChange={(value) => onAnswerChange(question.id, value)}
          isDarkMode={isDarkMode}
          answers={answers}
          onAddStory={onAddStory}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  );
}
