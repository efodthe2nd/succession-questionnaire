import { Section } from '@/lib/questions';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  isDarkMode: boolean;
}

export default function ProgressModal({ isOpen, onClose, sections, currentSectionIndex, onSectionChange, isDarkMode }: ProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop with fade animation */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal with slide-up animation */}
      <div
        className={`relative w-full max-h-[75vh] rounded-t-3xl overflow-hidden transition-all duration-300 ease-out transform ${
          isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
        }`}
        style={{
          boxShadow: isDarkMode
            ? '0 -8px 30px rgba(0, 0, 0, 0.4), 0 -2px 10px rgba(0, 0, 0, 0.2)'
            : '0 -8px 30px rgba(0, 0, 0, 0.15), 0 -2px 10px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
        </div>

        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Your Progress
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors duration-150 ${
              isDarkMode
                ? 'text-white hover:bg-gray-800'
                : 'text-black hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Section List */}
        <div className="overflow-y-auto max-h-[60vh] px-4 py-3">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-150 ${
                  section.id === currentSectionIndex
                    ? isDarkMode
                      ? 'bg-[#2a2a2a] border border-gray-700'
                      : 'bg-gray-100 border border-gray-200'
                    : isDarkMode
                      ? 'hover:bg-[#252525]'
                      : 'hover:bg-gray-50'
                }`}
              >
                <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Step {section.id}
                </p>
                <p className={`font-medium mt-0.5 ${
                  section.id === currentSectionIndex
                    ? 'text-[#B5A692]'
                    : isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {section.title}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
