'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { sections, getQuestionsBySection, getSectionByIndex } from '@/lib/questions';
import LoadingScreen from '@/components/questionnaire/ui/LoadingScreen';
import DesktopLayout from '@/components/questionnaire/layouts/DesktopLayout';
import MobileLayout from '@/components/questionnaire/layouts/MobileLayout';

const INITIAL_TIME_SECONDS = 2 * 60 * 60; // 2 hours in seconds

export default function QuestionnairePage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME_SECONDS);
  const router = useRouter();
  const supabase = createClient();

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(timeRemaining);
  const currentSection = getSectionByIndex(currentSectionIndex);
  const currentQuestions = getQuestionsBySection(currentSectionIndex);

  // Initialize user session and load data
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
        setCurrentSectionIndex(existingSubmission.current_section_index || 1);
        // Restore saved timer
        if (existingSubmission.time_remaining !== null && existingSubmission.time_remaining !== undefined) {
          setTimeRemaining(existingSubmission.time_remaining);
        }

        const { data: existingAnswers } = await supabase
          .from('answers')
          .select('*')
          .eq('submission_id', existingSubmission.id);

        const answersMap: Record<string, string | string[]> = {};
        existingAnswers?.forEach((a) => {
          try {
            answersMap[a.question_id] = JSON.parse(a.answer_text);
          } catch {
            answersMap[a.question_id] = a.answer_text;
          }
        });
        setAnswers(answersMap);
      } else {
        const { data: newSubmission } = await supabase
          .from('submissions')
          .insert({
            user_id: user.id,
            current_section_index: 1,
            time_remaining: INITIAL_TIME_SECONDS
          })
          .select()
          .single();
        setSubmissionId(newSubmission?.id);
      }
      setIsLoading(false);
    };
    init();
  }, [router, supabase]);

  const saveAnswer = async (questionId: string, value: string | string[]) => {
    // Always update local state immediately
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));

    // Only save to DB if we have a submission
    if (!submissionId) {
      console.warn('No submissionId available, answer saved locally only');
      return;
    }

    const answerText = typeof value === 'string' ? value : JSON.stringify(value);
    await supabase.from('answers').upsert({
      submission_id: submissionId,
      question_id: questionId,
      answer_text: answerText,
    });
  };

  const handleSave = async () => {
    if (!submissionId) return;
    await supabase
      .from('submissions')
      .update({
        current_section_index: currentSectionIndex,
        time_remaining: timeRemaining
      })
      .eq('id', submissionId);
  };

  const handleNext = async () => {
    if (currentSectionIndex < sections.length) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      await supabase
        .from('submissions')
        .update({ current_section_index: newIndex, time_remaining: timeRemaining })
        .eq('id', submissionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await supabase
        .from('submissions')
        .update({ status: 'completed', submitted_at: new Date().toISOString() })
        .eq('id', submissionId);
      router.push('/thank-you');
    }
  };

  const handlePrevious = async () => {
    if (currentSectionIndex > 1) {
      const newIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(newIndex);
      await supabase
        .from('submissions')
        .update({ current_section_index: newIndex, time_remaining: timeRemaining })
        .eq('id', submissionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    handleSave();
    router.push('/');
  };

  const goToSection = async (index: number) => {
    setCurrentSectionIndex(index);
    setShowProgressModal(false);
    await supabase
      .from('submissions')
      .update({ current_section_index: index })
      .eq('id', submissionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal);
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen isDarkMode={isDarkMode} />;
  }

  if (!currentSection) {
    return <LoadingScreen isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#F5F5F5]'}`}>
      {/* Desktop Layout */}
      <DesktopLayout
        sections={sections}
        currentSection={currentSection}
        currentQuestions={currentQuestions}
        currentSectionIndex={currentSectionIndex}
        answers={answers}
        isDarkMode={isDarkMode}
        submissionId={submissionId}
        initialTime={timeRemaining}
        onAnswerChange={saveAnswer}
        onSectionChange={goToSection}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSave={handleSave}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Mobile Layout */}
      <MobileLayout
        sections={sections}
        currentSection={currentSection}
        currentQuestions={currentQuestions}
        currentSectionIndex={currentSectionIndex}
        answers={answers}
        time={time}
        isDarkMode={isDarkMode}
        showProgressModal={showProgressModal}
        onAnswerChange={saveAnswer}
        onSectionChange={goToSection}
        onNext={handleNext}
        onSave={handleSave}
        onToggleDarkMode={toggleDarkMode}
        onToggleProgressModal={toggleProgressModal}
        onBack={handleBack}
      />
    </div>
  );
}
