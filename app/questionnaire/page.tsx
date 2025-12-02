'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { questions } from '@/lib/questions';
import QuestionInput from '@/components/QuestionInput';

export default function QuestionnairePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Get unique sections for sidebar
  const sections = Array.from(new Set(questions.map(q => q.section)));
  const currentSection = questions[currentIndex].section;

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingSubmission) {
        setSubmissionId(existingSubmission.id);
        setCurrentIndex(existingSubmission.current_question_index);

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
        const { data: newSubmission } = await supabase
          .from('submissions')
          .insert({ user_id: user.id })
          .select()
          .single();
        setSubmissionId(newSubmission?.id);
      }
    };
    init();
  }, [router, supabase]);

  const saveAnswer = async (questionId: string, value: string) => {
    if (!submissionId) return;
    setAnswers({ ...answers, [questionId]: value });
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
      await supabase
        .from('submissions')
        .update({ current_question_index: newIndex })
        .eq('id', submissionId);
    } else {
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

  if (!submissionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F5F5F5] md:flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r border-[#E5E5E5] p-8">
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-2">Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[#999999]">{Math.round(progress)}%</p>
        </div>

        <nav className="space-y-2">
          {sections.map((section, idx) => (
            <div
              key={section}
              className={`text-sm p-2 rounded cursor-pointer transition-colors ${
                section === currentSection
                  ? 'bg-black text-white'
                  : 'text-[#666666] hover:bg-gray-100'
              }`}
            >
              {idx + 1}. {section}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto">
        {/* Question Card */}
        <div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
          <h2 className="text-lg md:text-xl font-heading font-semibold mb-6">
            {currentQuestion.text}
          </h2>
          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id] || ''}
            onChange={(value) => saveAnswer(currentQuestion.id, value)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            {currentIndex === questions.length - 1 ? 'Submit →' : 'Next →'}
          </button>
        </div>
      </main>
    </div>
  );
}