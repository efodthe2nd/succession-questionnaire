'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/questions';

interface MultiselectInputProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

export default function MultiselectInput({ question, value, onChange, isDarkMode }: MultiselectInputProps) {
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

  const currentValues = value || [];

  const handleToggleOption = (option: string) => {
    const isSelected = currentValues.includes(option);
    if (isSelected) {
      onChange(currentValues.filter(v => v !== option));
    } else {
      onChange([...currentValues, option]);
    }
  };

  const handleRemoveTag = (optionToRemove: string) => {
    onChange(currentValues.filter(v => v !== optionToRemove));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center justify-between transition-all duration-200 ${
          isDarkMode
            ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
            : 'bg-white text-black border border-gray-300 hover:border-gray-400'
        } focus:outline-none focus:border-[#B5A692]`}
      >
        <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
          {question.placeholder || 'Select'}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Custom Dropdown Menu */}
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
        style={{ maxHeight: '200px' }}
      >
        <div className="overflow-y-auto max-h-[200px] py-1">
          {question.options?.map((option) => {
            const isSelected = currentValues.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggleOption(option)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-[#B5A692]/20 text-[#B5A692]'
                      : 'bg-[#B5A692]/20 text-[#8B7355]'
                    : isDarkMode
                      ? 'text-white hover:bg-[#3a3a3a]'
                      : 'text-black hover:bg-gray-100'
                }`}
              >
                <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#B5A692] border-[#B5A692]'
                    : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected tags */}
      {currentValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {currentValues.map((val) => (
            <span
              key={val}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-150 ${
                isDarkMode ? 'bg-[#B5A692] text-black' : 'bg-[#B5A692] text-white'
              }`}
            >
              {val.length > 20 ? val.substring(0, 20) + '...' : val}
              <button
                type="button"
                onClick={() => handleRemoveTag(val)}
                className="ml-1 hover:opacity-70 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
