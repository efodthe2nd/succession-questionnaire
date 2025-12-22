interface DesktopHeaderProps {
  sectionTitle: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSave: () => void;
  onPrevious: () => void;
  canGoPrevious: boolean;
  saveStatus?: 'idle' | 'saving' | 'saved';
}

export default function DesktopHeader({ sectionTitle, isDarkMode, onToggleDarkMode, onSave, onPrevious, canGoPrevious, saveStatus = 'idle' }: DesktopHeaderProps) {
  return (
    <header className={`sticky top-0 z-30 px-8 py-4 flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a] border-b border-gray-800' : 'bg-[#F5F5F5] border-b border-gray-200'}`}>
      <h1 className={`text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-black'}`} style={{ fontFamily: 'Georgia, serif' }}>
        {sectionTitle}
      </h1>
      <div className="flex items-center gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
        {/* Save button */}
        <button
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            saveStatus === 'saved'
              ? 'bg-green-600 text-white border-2 border-green-400'
              : saveStatus === 'saving'
                ? 'bg-gray-600 text-white cursor-wait'
                : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {saveStatus === 'saving' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            'Save'
          )}
        </button>
        {/* Previous button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`px-5 py-2 rounded-lg text-sm font-medium ${
            !canGoPrevious
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white'
          }`}
        >
          Previous
        </button>
      </div>
    </header>
  );
}
