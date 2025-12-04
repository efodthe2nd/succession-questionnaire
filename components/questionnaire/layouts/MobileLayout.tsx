import { Section, Question } from '@/lib/questions';
import MobileHeader from '../headers/MobileHeader';
import SectionIndicator from '../ui/SectionIndicator';
import QuestionList from '../questions/QuestionList';
import PreviewCard from '../ui/PreviewCard';
import NextButton from '../ui/NextButton';
import ProgressModal from '../ui/ProgressModal';

interface MobileLayoutProps {
  sections: Section[];
  currentSection: Section;
  currentQuestions: Question[];
  currentSectionIndex: number;
  answers: Record<string, string | string[]>;
  time: { hours: string; minutes: string; seconds: string };
  isDarkMode: boolean;
  showProgressModal: boolean;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
  onSectionChange: (index: number) => void;
  onNext: () => void;
  onSave: () => void;
  onToggleDarkMode: () => void;
  onToggleProgressModal: () => void;
  onBack: () => void;
}

export default function MobileLayout({
  sections,
  currentSection,
  currentQuestions,
  currentSectionIndex,
  answers,
  time,
  isDarkMode,
  showProgressModal,
  onAnswerChange,
  onSectionChange,
  onNext,
  onSave,
  onToggleDarkMode,
  onToggleProgressModal,
  onBack,
}: MobileLayoutProps) {
  return (
    <div className="lg:hidden flex flex-col min-h-screen">
      {/* Mobile Header with Timer */}
      <MobileHeader
        sectionTitle={currentSection.title}
        time={time}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        onSave={onSave}
        onBack={onBack}
      />

      {/* Section Indicator / Progress Dropdown */}
      <SectionIndicator
        section={currentSection}
        currentIndex={currentSectionIndex}
        totalSections={sections.length}
        onClick={onToggleProgressModal}
        isDarkMode={isDarkMode}
      />

      {/* Questions Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-6">
          <QuestionList
            questions={currentQuestions}
            answers={answers}
            onAnswerChange={onAnswerChange}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Preview Card */}
      <div className="mx-4 mb-4">
        <PreviewCard isDarkMode={isDarkMode} />
      </div>

      {/* Next Button */}
      <NextButton
        onClick={onNext}
        isLastSection={currentSectionIndex === sections.length}
        isDesktop={false}
        isDarkMode={isDarkMode}
      />

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={onToggleProgressModal}
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={onSectionChange}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
