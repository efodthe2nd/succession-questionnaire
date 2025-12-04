import { Section } from '@/lib/questions';

interface SectionIndicatorProps {
  section: Section;
  currentIndex: number;
  totalSections: number;
  onClick: () => void;
  isDarkMode: boolean;
}

export default function SectionIndicator({ section, currentIndex, totalSections, onClick, isDarkMode }: SectionIndicatorProps) {
  return (
    <div className={`px-4 py-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {/* Circular number badge */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${isDarkMode ? 'bg-[#B5A692] text-black' : 'bg-[#B5A692] text-white'}`}>
            {currentIndex}
          </div>
          <div>
            <p className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {section.title}
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Step {currentIndex} of {totalSections}
            </p>
          </div>
        </div>
        <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
