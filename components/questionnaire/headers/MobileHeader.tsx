import TimerDisplay from '../timer/TimerDisplay';

interface MobileHeaderProps {
  sectionTitle: string;
  time: { hours: string; minutes: string; seconds: string };
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSave: () => void;
  onBack: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved';
}

export default function MobileHeader({ sectionTitle, time, isDarkMode, onToggleDarkMode, onSave, onBack, saveStatus = 'idle' }: MobileHeaderProps) {
  return (
    <header className={`sticky top-0 z-30 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Timer Row */}
      <div className="px-4 py-2 flex items-center justify-center bg-black">
        <TimerDisplay hours={time.hours} minutes={time.minutes} seconds={time.seconds} compact />
      </div>

      {/* Title and Actions Row */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {sectionTitle}
        </span>
        <div className="flex items-center gap-3">
          {/* Dark/Light mode toggle */}
          <button onClick={onToggleDarkMode} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          {/* Save icon */}
          <button
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            className={`transition-all duration-300 ${
              saveStatus === 'saved'
                ? 'text-green-500'
                : saveStatus === 'saving'
                  ? 'text-gray-400 cursor-wait'
                  : isDarkMode ? 'text-white' : 'text-black'
            }`}
          >
            {saveStatus === 'saving' ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : saveStatus === 'saved' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
          </button>
          {/* Back/Close */}
          <button onClick={onBack} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
