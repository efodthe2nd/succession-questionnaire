import { Section } from '@/lib/questions';

interface SectionNavigationListProps {
  sections: Section[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  isDarkMode: boolean;
}

export default function SectionNavigationList({ sections, currentSectionIndex, onSectionChange, isDarkMode }: SectionNavigationListProps) {
  return (
    <nav className="flex-1 space-y-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-2 ${
            section.id === currentSectionIndex
              ? 'text-[#B5A692]'
              : isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-[#252525]'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          {section.id === currentSectionIndex && (
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span className={`text-sm ${section.id !== currentSectionIndex ? 'ml-6' : ''}`}>
            {section.id}. {section.title}
          </span>
        </button>
      ))}
    </nav>
  );
}
