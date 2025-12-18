'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/questions';



interface MultiselectInputProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

// Questions that should be expanded by default (not collapsible)
const EXPANDED_BY_DEFAULT = ['q2_2', 'q2_3'];
const DEFAULT_MAX_SELECTIONS = 5;

export default function MultiselectInput({ question, value, onChange, isDarkMode }: MultiselectInputProps) {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Use question-specific maxSelections or default
  const maxSelections = question.maxSelections || DEFAULT_MAX_SELECTIONS;

  // Collapsible state - some questions start expanded
  const shouldExpandByDefault = EXPANDED_BY_DEFAULT.includes(question.id);
  const [isExpanded, setIsExpanded] = useState(shouldExpandByDefault);

  // Handle both array and string values (for backwards compatibility with dropdown->multiselect conversion)
  const currentValues = Array.isArray(value) ? value : (value ? [value as unknown as string] : []);

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
    // Auto-expand if there are already selections
    if (currentValues.length > 0) {
      setIsExpanded(true);
    }
  }, []);

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

  
  // Collapsed view - show expand button
  if (!isExpanded) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center justify-between ${
            isDarkMode
              ? 'border-gray-700 text-gray-400 bg-transparent hover:border-gray-600 hover:text-gray-300'
              : 'border-gray-300 text-gray-500 bg-transparent hover:border-gray-400 hover:text-gray-600'
          }`}
        >
          <span>Select up to {maxSelections}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    );
  }

return (
    <div>
      {/* Selection counter */}
      <div className={`flex justify-between items-center mb-3`}>
        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {selectionCount}/{maxSelections} selected
        </span>
        {!shouldExpandByDefault && (
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className={`text-xs ${isDarkMode ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}
          >
            Collapse
          </button>
        )}
      </div>

      {/* Chip/Pill Grid - All options visible at once */}
      <div className="flex flex-wrap gap-2">
        {question.options?.map((option) => {
          const isSelected = currentValues.includes(option);
          const isDisabled = !isSelected && isAtLimit;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggleOption(option)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                isSelected
                  ? isDarkMode
                    ? 'bg-[#B5A692] text-black border-[#B5A692]'
                    : 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : isDisabled
                    ? isDarkMode
                      ? 'bg-transparent text-gray-600 border-gray-700 cursor-not-allowed opacity-50'
                      : 'bg-transparent text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                    : isDarkMode
                      ? 'bg-transparent text-white border-gray-600 hover:border-gray-400'
                      : 'bg-transparent text-black border-gray-300 hover:border-gray-500'
              }`}
            >
              {option}
            </button>
          );
        })}

        {/* Custom answer chip */}
        <button
          type="button"
          onClick={handleToggleCustomInput}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
            showCustomInput && customText.trim()
              ? isDarkMode
                ? 'bg-[#B5A692] text-black border-[#B5A692]'
                : 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
              : isDarkMode
                ? 'bg-transparent text-[#B5A692] border-[#B5A692] hover:bg-[#B5A692]/10'
                : 'bg-transparent text-[#8B7355] border-[#8B7355] hover:bg-[#8B7355]/10'
          }`}
        >
          Say it in your own words.
        </button>
      </div>

      {/* Custom text input field */}
      {showCustomInput && (
        <div className="mt-4">
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
          <div className={`flex justify-between items-center mt-1`}>
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {customText.length}/140 characters
            </span>
          </div>

          {/* Copyable options list */}
          {question.options && question.options.length > 0 && (
            <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Copy from options:
              </p>
              <div className={`text-sm select-text ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {question.options.map((option, index) => (
                  <span key={option} className="cursor-text">
                    {option}{index < question.options!.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
