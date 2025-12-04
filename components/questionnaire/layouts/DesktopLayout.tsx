import { Section, Question } from '@/lib/questions';
import LeftSidebar from '../sidebars/LeftSidebar';
import RightSidebar from '../sidebars/RightSidebar';
import DesktopHeader from '../headers/DesktopHeader';
import QuestionList from '../questions/QuestionList';
import NextButton from '../ui/NextButton';
import Footer from '../ui/Footer';

interface DesktopLayoutProps {
  sections: Section[];
  currentSection: Section;
  currentQuestions: Question[];
  currentSectionIndex: number;
  answers: Record<string, string | string[]>;
  isDarkMode: boolean;
  submissionId: string | null;
  initialTime: number;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
  onSectionChange: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onToggleDarkMode: () => void;
}

export default function DesktopLayout({
  sections,
  currentSection,
  currentQuestions,
  currentSectionIndex,
  answers,
  isDarkMode,
  submissionId,
  initialTime,
  onAnswerChange,
  onSectionChange,
  onNext,
  onPrevious,
  onSave,
  onToggleDarkMode,
}: DesktopLayoutProps) {
  return (
    <div className="hidden lg:flex min-h-screen">
      {/* Left Sidebar */}
      <LeftSidebar
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={onSectionChange}
        isDarkMode={isDarkMode}
        submissionId={submissionId}
        initialTime={initialTime}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 mr-80">
        {/* Top Header */}
        <DesktopHeader
          sectionTitle={currentSection.title}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          onSave={onSave}
          onPrevious={onPrevious}
          canGoPrevious={currentSectionIndex > 1}
        />

        {/* Questions Area */}
        <div className="p-8 pb-32">
          <div className="max-w-2xl space-y-8">
            <QuestionList
              questions={currentQuestions}
              answers={answers}
              onAnswerChange={onAnswerChange}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Next Button - Fixed at bottom of content area */}
        <NextButton
          onClick={onNext}
          isLastSection={currentSectionIndex === sections.length}
          isDesktop
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Right Sidebar - Preview */}
      <RightSidebar isDarkMode={isDarkMode} />

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
