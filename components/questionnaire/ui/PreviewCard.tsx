interface PreviewCardProps {
  isDesktop?: boolean;
  isDarkMode: boolean;
}

export default function PreviewCard({ isDesktop = false, isDarkMode }: PreviewCardProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${
      isDesktop
        ? 'bg-white border border-gray-200'
        : isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#E8E4DC]'
    }`}>
      {isDesktop && (
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Title: <span className="text-black">Succession Story Questionaire</span></p>
          <p className="text-xs text-gray-500 mb-3">Subtitle: <span className="text-black">A short guide to help you express your values, intentions, and legacy.</span></p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>Key experiences that shaped you (Textarea)</p>
            <p>Values that guide your decisions (Textarea)</p>
            <p>A memory or tradition you want preserved (Textarea)</p>
            <p className="mt-2">Key experiences that shaped you (Textarea)</p>
            <p>Values that guide your decisions (Textarea)</p>
          </div>
        </div>
      )}
      {!isDesktop && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Succession Story Questionaire
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A Short Guide to Help You Express Your Values
              </p>
            </div>
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
      <button
        disabled
        className={`w-full py-3 flex items-center justify-center gap-2 text-sm relative ${
          isDesktop
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isDarkMode
              ? 'bg-[#3a3a3a] text-gray-500 border-t border-gray-700 cursor-not-allowed'
              : 'bg-[#D8D4CC] text-gray-500 border-t border-gray-300 cursor-not-allowed'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview
        <span className="absolute right-3 text-[10px] bg-[#B5A692] text-black px-2 py-0.5 rounded-full">Soon</span>
      </button>
    </div>
  );
}
