'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/questions';

interface MultiDropdownInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

const DEFAULT_MAX_SELECTIONS = 5;

export default function MultiDropdownInput({ question, value, onChange, isDarkMode }: MultiDropdownInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use question-specific maxSelections or default
  const maxSelections = question.maxSelections || DEFAULT_MAX_SELECTIONS;

  // Handle both array and string values for backwards compatibility
  const currentValues = Array.isArray(value) ? value : (value ? [value] : []);

  // Count selections from predefined options only (not custom text)
  const selectionCount = currentValues.filter(v => question.options?.includes(v)).length;
  const isAtLimit = selectionCount >= maxSelections;

  // Check if any current values are custom (not in options)
  const customValues = currentValues.filter(v => !question.options?.includes(v));

  // Initialize custom input if there are custom values
  useEffect(() => {
    if (customValues.length > 0) {
      setShowCustomInput(true);
      setCustomText(customValues[0] || '');
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

  const handleToggleOption = (option: string) => {
    const isSelected = currentValues.includes(option);
    if (isSelected) {
      onChange(currentValues.filter(v => v !== option));
    } else {
      // Only allow adding if not at limit
      if (!isAtLimit) {
        onChange([...currentValues, option]);
      }
    }
  };

  const handleCustomTextChange = (text: string) => {
    if (text.length <= 140) {
      // Remove the old custom value if it exists
      const newValues = currentValues.filter(v => question.options?.includes(v));
      setCustomText(text);
      if (text.trim()) {
        onChange([...newValues, text]);
      } else {
        onChange(newValues);
      }
    }
  };

  const handleToggleCustomInput = () => {
    if (showCustomInput) {
      // If hiding, also remove the custom value
      const newValues = currentValues.filter(v => question.options?.includes(v));
      onChange(newValues);
      setCustomText('');
    }
    setShowCustomInput(!showCustomInput);
  };

  // Display text for the dropdown button
  const getDisplayText = () => {
    if (currentValues.length === 0) {
      return question.placeholder || 'Select options';
    }
    if (currentValues.length === 1) {
      const val = currentValues[0];
      return val.length > 50 ? val.substring(0, 50) + '...' : val;
    }
    return `${currentValues.length} selected`;
  };

  const hasAnswer = currentValues.length > 0;

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
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {selectionCount}/{maxSelections}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu with Checkboxes */}
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
        style={{ maxHeight: '300px' }}
      >
        <div className="overflow-y-auto max-h-[300px] py-1">
          {question.options?.map((option) => {
            const isSelected = currentValues.includes(option);
            const isDisabled = !isSelected && isAtLimit;
            return (
              <label
                key={option}
                className={`w-full px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors duration-150 ${
                  isDisabled
                    ? isDarkMode
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                    : isSelected
                      ? isDarkMode
                        ? 'bg-[#B5A692]/20 text-[#B5A692]'
                        : 'bg-[#B5A692]/20 text-[#8B7355]'
                      : isDarkMode
                        ? 'text-white hover:bg-[#3a3a3a]'
                        : 'text-black hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => handleToggleOption(option)}
                  className={`w-5 h-5 rounded border-2 appearance-none cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-[#B5A692] border-[#B5A692]'
                        : 'bg-[#1a1a1a] border-[#1a1a1a]'
                      : isDisabled
                        ? isDarkMode
                          ? 'border-gray-700 bg-transparent'
                          : 'border-gray-300 bg-transparent'
                        : isDarkMode
                          ? 'border-gray-600 bg-transparent hover:border-gray-500'
                          : 'border-gray-300 bg-transparent hover:border-gray-400'
                  }`}
                  style={{
                    backgroundImage: isSelected
                      ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='${isDarkMode ? 'black' : 'white'}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                      : 'none',
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <span className="select-text">{option}</span>
              </label>
            );
          })}

          {/* Custom text option - always last */}
          <div
            onClick={handleToggleCustomInput}
            className={`w-full px-4 py-3 text-left transition-colors duration-150 border-t cursor-pointer flex items-center gap-3 ${
              showCustomInput
                ? isDarkMode
                  ? 'bg-[#B5A692]/20 text-[#B5A692] border-gray-700'
                  : 'bg-[#B5A692]/20 text-[#8B7355] border-gray-200'
                : isDarkMode
                  ? 'text-[#B5A692] hover:bg-[#3a3a3a] border-gray-700'
                  : 'text-[#8B7355] hover:bg-gray-100 border-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 transition-all duration-150 ${
                showCustomInput && customText.trim()
                  ? isDarkMode
                    ? 'bg-[#B5A692] border-[#B5A692]'
                    : 'bg-[#1a1a1a] border-[#1a1a1a]'
                  : isDarkMode
                    ? 'border-[#B5A692] bg-transparent'
                    : 'border-[#8B7355] bg-transparent'
              }`}
              style={{
                backgroundImage: showCustomInput && customText.trim()
                  ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='${isDarkMode ? 'black' : 'white'}' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E")`
                  : 'none',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
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
