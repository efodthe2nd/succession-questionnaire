'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/questions';

interface DropdownInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

export default function DropdownInput({ question, value, onChange, isDarkMode }: DropdownInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if current value is a custom value (not in options)
  const isCustomValue = value && !question.options?.includes(value);

  // Initialize custom text if value is custom
  useEffect(() => {
    if (isCustomValue) {
      setCustomText(value);
      setShowCustomInput(true);
    }
  }, []);

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

  // Improved value display logic (includes recent fix)
  const displayValue = (typeof value === 'string' && value.trim()) ||
                      (typeof value === 'number' && String(value)) ||
                      '';
  const hasAnswer = Boolean(displayValue);

  const handleCustomTextChange = (text: string) => {
    if (text.length <= 140) {
      setCustomText(text);
      onChange(text);
    }
  };

  const handleSelectCustomOption = () => {
    setShowCustomInput(true);
    setIsOpen(false);
    // If there's already custom text, use it; otherwise clear the value
    if (customText) {
      onChange(customText);
    }
  };

  const handleSelectOption = (option: string) => {
    setShowCustomInput(false);
    setCustomText('');
    onChange(option);
    setIsOpen(false);
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
        <span className={hasAnswer ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}>
          {hasAnswer ? (displayValue.length > 50 ? displayValue.substring(0, 50) + '...' : displayValue) : (question.placeholder || 'Select')}
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
        style={{ maxHeight: '250px' }}
      >
        <div className="overflow-y-auto max-h-[250px] py-1">
          {question.options?.map((option) => (
            <div
              key={option}
              onClick={(e) => {
                // Only select if user isn't highlighting text
                const selection = window.getSelection();
                if (!selection || selection.toString().length === 0) {
                  handleSelectOption(option);
                }
              }}
              className={`w-full px-4 py-3 text-left transition-colors duration-150 select-text cursor-text ${
                value === option
                  ? isDarkMode
                    ? 'bg-[#B5A692]/20 text-[#B5A692]'
                    : 'bg-[#B5A692]/20 text-[#8B7355]'
                  : isDarkMode
                    ? 'text-white hover:bg-[#3a3a3a]'
                    : 'text-black hover:bg-gray-100'
              }`}
            >
              {option}
            </div>
          ))}
          {/* Custom text option - always last */}
          <div
            onClick={handleSelectCustomOption}
            className={`w-full px-4 py-3 text-left transition-colors duration-150 border-t cursor-pointer ${
              showCustomInput
                ? isDarkMode
                  ? 'bg-[#B5A692]/20 text-[#B5A692] border-gray-700'
                  : 'bg-[#B5A692]/20 text-[#8B7355] border-gray-200'
                : isDarkMode
                  ? 'text-[#B5A692] hover:bg-[#3a3a3a] border-gray-700'
                  : 'text-[#8B7355] hover:bg-gray-100 border-gray-200'
            }`}
          >
            Say it in your own words.
          </div>
        </div>
      </div>

      {/* Custom text input field */}
      {showCustomInput && (
        <div className="mt-3">
          <textarea
            value={customText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Say it in your own words."
            maxLength={140}
            rows={2}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 resize-none ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600 placeholder-gray-500'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400 placeholder-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          />
          <div className={`text-xs mt-1 text-right ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {customText.length}/140 characters
          </div>
        </div>
      )}
    </div>
  );
}
