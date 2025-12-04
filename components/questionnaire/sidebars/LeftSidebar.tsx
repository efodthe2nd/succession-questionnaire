import { Section } from '@/lib/questions';
import Timer from '../timer/Timer';
import SectionNavigationList from './SectionNavigationList';

interface LeftSidebarProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  isDarkMode: boolean;
  submissionId: string | null;
  initialTime: number;
}

export default function LeftSidebar({ sections, currentSectionIndex, onSectionChange, isDarkMode, submissionId, initialTime }: LeftSidebarProps) {
  return (
    <aside className={`w-64 fixed left-0 top-0 bottom-0 flex flex-col p-6 ${isDarkMode ? 'bg-[#1a1a1a] border-r border-gray-800' : 'bg-white border-r border-gray-200'}`}>
      {/* Timer */}
      <div className="mb-8">
        <Timer submissionId={submissionId} initialTime={initialTime} />
      </div>

      {/* Section Navigation */}
      <SectionNavigationList
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        onSectionChange={onSectionChange}
        isDarkMode={isDarkMode}
      />
    </aside>
  );
}
