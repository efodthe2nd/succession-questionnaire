'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/questions';

interface HandwritingStyleInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

// Define handwriting styles with their corresponding font classes
const handwritingStyles = [
  {
    id: 'style-1',
    label: 'Style 1 - Times New Roman',
    fontClass: 'font-times-new-roman',
    example: 'With all my love, always',
  },
  {
    id: 'style-2',
    label: 'Style 2 - Antic',
    fontClass: 'font-antic',
    example: 'With all my love, always',
  },
  {
    id: 'style-3',
    label: 'Style 3 - Over The Rainbow',
    fontClass: 'font-over-the-rainbow',
    example: 'With all my love, always',
  },
  {
    id: 'style-4',
    label: 'Style 4 - Handsome',
    fontClass: 'font-handlee',
    example: 'With all my love, always',
  },
  {
    id: 'style-5',
    label: 'Style 5 - Biro Script Plus',
    fontClass: 'font-caveat',
    example: 'With all my love, always',
  },
  {
    id: 'style-6',
    label: 'Style 6 - Canva Student Font',
    fontClass: 'font-kalam',
    example: 'With all my love, always',
  },
];

export default function HandwritingStyleInput({
  question,
  value,
  onChange,
  isDarkMode,
}: HandwritingStyleInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Find selected style
  const selectedStyle = handwritingStyles.find((s) => s.label === value);
  const hasAnswer = Boolean(value);

  const handleSelectOption = (styleLabel: string) => {
    onChange(styleLabel);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center justify-between transition-all duration-200 ${
          isDarkMode
            ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
            : 'bg-white text-black border border-gray-300 hover:border-gray-400'
        } focus:outline-none focus:border-[#B5A692]`}
      >
        {selectedStyle ? (
          <div className="flex items-center justify-between w-full pr-2 gap-4">
            <span className={isDarkMode ? 'text-white' : 'text-black'}>
              {selectedStyle.label.split(' - ')[0]}
            </span>
            <span
              className={`text-lg ${selectedStyle.fontClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {selectedStyle.example}
            </span>
          </div>
        ) : (
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
            {question.placeholder || 'Select a handwriting style'}
          </span>
        )}
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 transition-all duration-200 ease-out origin-top ${
          isOpen
            ? 'opacity-100 scale-y-100 translate-y-0'
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
        } ${
          isDarkMode
            ? 'bg-[#2a2a2a] border border-gray-700 shadow-lg shadow-black/30'
            : 'bg-white border border-gray-200 shadow-lg shadow-black/10'
        }`}
      >
        <div className="overflow-y-auto max-h-[300px] py-1">
          {handwritingStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelectOption(style.label)}
              className={`w-full px-4 py-4 text-left transition-colors duration-150 flex items-center justify-between gap-4 ${
                value === style.label
                  ? isDarkMode
                    ? 'bg-[#B5A692]/20'
                    : 'bg-[#B5A692]/20'
                  : isDarkMode
                    ? 'hover:bg-[#3a3a3a]'
                    : 'hover:bg-gray-100'
              }`}
            >
              {/* Style label on the left */}
              <span
                className={`text-sm font-medium flex-shrink-0 ${
                  value === style.label
                    ? isDarkMode
                      ? 'text-[#B5A692]'
                      : 'text-[#8B7355]'
                    : isDarkMode
                      ? 'text-white'
                      : 'text-black'
                }`}
              >
                {style.label.split(' - ')[0]}
                <span className={`font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {' - '}
                  {style.label.split(' - ')[1]}
                </span>
              </span>

              {/* Example text on the right in the actual font */}
              <span
                className={`text-xl ${style.fontClass} ${
                  value === style.label
                    ? isDarkMode
                      ? 'text-[#B5A692]'
                      : 'text-[#8B7355]'
                    : isDarkMode
                      ? 'text-gray-300'
                      : 'text-gray-600'
                }`}
              >
                {style.example}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
