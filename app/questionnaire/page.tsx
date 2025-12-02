'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { questions, Question } from '@/lib/questions';
import QuestionInput from '@/components/QuestionInput';

export default function QuestionnairePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check auth + load existing submission
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Check for existing submission
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingSubmission) {
        setSubmissionId(existingSubmission.id);
        setCurrentIndex(existingSubmission.current_question_index);

        // Load existing answers
        const { data: existingAnswers } = await supabase
          .from('answers')
          .select('*')
          .eq('submission_id', existingSubmission.id);

        const answersMap: Record<string, string> = {};
        existingAnswers?.forEach((a) => {
          answersMap[a.question_id] = a.answer_text;
        });
        setAnswers(answersMap);
      } else {
        // Create new submission
        const { data: newSubmission } = await supabase
          .from('submissions')
          .insert({ user_id: user.id })
          .select()
          .single();
        setSubmissionId(newSubmission?.id);
      }
    };
    init();
  }, [router]);

  const saveAnswer = async (questionId: string, value: string) => {
    if (!submissionId) return;

    setAnswers({ ...answers, [questionId]: value });

    // Upsert answer
    await supabase.from('answers').upsert({
      submission_id: submissionId,
      question_id: questionId,
      answer_text: value,
    });
  };

  const handleNext = async () => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert('This question is required');
      return;
    }

    if (currentIndex < questions.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      // Save progress
      await supabase
        .from('submissions')
        .update({ current_question_index: newIndex })
        .eq('id', submissionId);
    } else {
      // Final submit
      await supabase
        .from('submissions')
        .update({ status: 'completed', submitted_at: new Date().toISOString() })
        .eq('id', submissionId);
      router.push('/thank-you');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  if (!submissionId) return <div>Loading...</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <p className="text-sm text-gray-500 mb-4">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
        
        <QuestionInput
          question={currentQuestion}
          value={answers[currentQuestion.id] || ''}
          onChange={(value) => saveAnswer(currentQuestion.id, value)}
        />

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
