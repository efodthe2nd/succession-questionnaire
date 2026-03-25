"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  sections,
  getQuestionsBySection,
  getSectionByIndex,
} from "@/lib/questions";
import LoadingScreen from "@/components/questionnaire/ui/LoadingScreen";
import DesktopLayout from "@/components/questionnaire/layouts/DesktopLayout";
import MobileLayout from "@/components/questionnaire/layouts/MobileLayout";
import PaywallModal from "@/components/PaywallModal";

const INITIAL_TIME_SECONDS = 2 * 60 * 60;

export default function QuestionnairePage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME_SECONDS);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [showPaywall, setShowPaywall] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const time = formatTime(timeRemaining);
  const currentSection = getSectionByIndex(currentSectionIndex);
  const currentQuestions = getQuestionsBySection(currentSectionIndex);

  useEffect(() => {
  const trackStart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return

    fetch('/api/leads/track-questionnaire-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    }).catch(err => console.error('[questionnaire] track start error:', err))
  }

  trackStart()
}, [])

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setShowExitIntent(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data: submissions } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const existingSubmission = submissions?.[0] || null;

      if (existingSubmission) {
        setSubmissionId(existingSubmission.id);
        setCurrentSectionIndex(existingSubmission.current_section_index || 1);
        if (
          existingSubmission.time_remaining !== null &&
          existingSubmission.time_remaining !== undefined
        ) {
          setTimeRemaining(existingSubmission.time_remaining);
        }

        const { data: existingAnswers } = await supabase
          .from("answers")
          .select("*")
          .eq("submission_id", existingSubmission.id);

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
        const { data: newSubmission, error } = await supabase
          .from("submissions")
          .insert({
            user_id: user.id,
            current_section_index: 1,
            time_remaining: INITIAL_TIME_SECONDS,
            status: "in_progress",
          })
          .select()
          .single();
        if (error) {
          console.error(
            "Failed to create submission:",
            error.message,
            error.code,
            error.details,
            error.hint,
          );
        }
        setSubmissionId(newSubmission?.id);
      }
      setIsLoading(false);
    };
    init();
  }, [router, supabase]);

  const saveAnswer = async (questionId: string, value: string | string[]) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));

    if (!submissionId) {
      console.warn("No submissionId available, answer saved locally only");
      return;
    }

    const answerText =
      typeof value === "string" ? value : JSON.stringify(value);
    const { error } = await supabase.from("answers").upsert(
      {
        submission_id: submissionId,
        question_id: questionId,
        answer_text: answerText,
      },
      { onConflict: "submission_id,question_id" },
    );

    if (error) {
      console.error(
        "Failed to save answer:",
        error.message,
        error.code,
        error.details,
        error.hint,
      );
    }
  };

  const handleSave = async () => {
    if (!submissionId) return;
    setSaveStatus("saving");
    await supabase
      .from("submissions")
      .update({
        current_section_index: currentSectionIndex,
        time_remaining: timeRemaining,
      })
      .eq("id", submissionId);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleNext = async () => {
    if (currentSectionIndex < sections.length) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      const { error } = await supabase
        .from("submissions")
        .update({
          current_section_index: newIndex,
          time_remaining: timeRemaining,
        })
        .eq("id", submissionId);
      if (error) {
        console.error(
          "Failed to update section:",
          error.message,
          error.code,
          error.details,
          error.hint,
        );
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Mark completed, save progress, then show paywall
      const { error } = await supabase
        .from("submissions")
        .update({ status: "completed", submitted_at: new Date().toISOString() })
        .eq("id", submissionId);

      if (error) {
        console.error(
          "Submission failed:",
          error.message,
          error.code,
          error.details,
          error.hint,
        );
        alert("Failed to submit. Please try again.");
        return;
      }

      // Fire notification (non-blocking)
      fetch("/api/notify-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      }).catch((err) => console.error("Failed to send notification:", err));

      // Show paywall instead of redirecting
      await handleSave();
      setShowPaywall(true);
    }
  };

  const handlePrevious = async () => {
    if (currentSectionIndex > 1) {
      const newIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(newIndex);
      await supabase
        .from("submissions")
        .update({
          current_section_index: newIndex,
          time_remaining: timeRemaining,
        })
        .eq("id", submissionId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    handleSave();
    router.push("/");
  };

  const goToSection = async (index: number) => {
    setCurrentSectionIndex(index);
    setShowProgressModal(false);
    await supabase
      .from("submissions")
      .update({ current_section_index: index })
      .eq("id", submissionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleProgressModal = () => setShowProgressModal(!showProgressModal);

  const handleAddStory = (baseQuestionId: string) => {
    const prefix = `${baseQuestionId}_additional_`;
    let nextIndex = 0;
    Object.keys(answers).forEach((key) => {
      if (key.startsWith(prefix)) {
        const index = parseInt(key.replace(prefix, ""), 10);
        if (!isNaN(index) && index >= nextIndex) nextIndex = index + 1;
      }
    });
    saveAnswer(`${prefix}${nextIndex}`, "");
  };

  if (isLoading) return <LoadingScreen isDarkMode={isDarkMode} />;
  if (!currentSection) return <LoadingScreen isDarkMode={isDarkMode} />;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#1a1a1a]" : "bg-[#F5F5F5]"}`}
    >
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
        onAddStory={handleAddStory}
        saveStatus={saveStatus}
      />

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
        onAddStory={handleAddStory}
        saveStatus={saveStatus}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        submissionId={submissionId ?? undefined}
      />

      {showExitIntent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowExitIntent(false)}
        >
          <div
            className="bg-white rounded-2xl p-10 max-w-md w-full mx-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[#B5A692] rounded-full mx-auto mb-6" />
            <h2
              className="text-2xl text-[#1a1a1a] mb-3"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Your progress is saved.
            </h2>
            <p className="text-[#4a4a4a] text-base leading-relaxed mb-8">
              You can continue exactly where you left off — anytime.
            </p>
            <button
              onClick={() => setShowExitIntent(false)}
              className="w-full py-4 bg-[#1a1a1a] text-[#B5A692] font-semibold rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Continue My Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
