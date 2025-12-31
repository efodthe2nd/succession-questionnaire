interface NextButtonProps {
  onClick: () => void;
  isLastSection: boolean;
  isDesktop: boolean;
  isDarkMode: boolean;
  disabled?: boolean;
}

export default function NextButton({ onClick, isLastSection, isDesktop, isDarkMode, disabled = false }: NextButtonProps) {
  if (isDesktop) {
    // Desktop: Inline button at bottom of content
    return (
      <div className="pt-8">
        <button
          onClick={onClick}
          disabled={disabled}
          className={`px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg ${
            disabled
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          {isLastSection ? 'Submit' : 'Next'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    );
  }

  // Mobile: Full-width button
  return (
    <div className="px-4 pb-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors ${
          disabled
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : isDarkMode
              ? 'bg-[#E8E4DC] text-black hover:bg-[#D8D4CC]'
              : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isLastSection ? 'Submit' : 'Next'}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
}
