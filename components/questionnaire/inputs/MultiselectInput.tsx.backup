'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/questions';

interface MultiselectInputProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
  isDarkMode: boolean;
}

export default function MultiselectInput({ question, value, onChange, isDarkMode }: MultiselectInputProps) {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const currentValues = value || [];

  // Check if any current values are custom (not in options)
  const customValues = currentValues.filter(v => !question.options?.includes(v));

  // Initialize custom input if there are custom values
  useEffect(() => {
    if (customValues.length > 0) {
      setShowCustomInput(true);
      setCustomText(customValues[0] || '');
    }
  }, []);

  const handleToggleOption = (option: string) => {
    const isSelected = currentValues.includes(option);
    if (isSelected) {
      onChange(currentValues.filter(v => v !== option));
    } else {
      onChange([...currentValues, option]);
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

  return (
    <div>
      {/* Chip/Pill Grid - All options visible at once */}
      <div className="flex flex-wrap gap-2">
        {question.options?.map((option) => {
          const isSelected = currentValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggleOption(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                isSelected
                  ? isDarkMode
                    ? 'bg-[#B5A692] text-black border-[#B5A692]'
                    : 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
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
          + Other
        </button>
      </div>

      {/* Custom text input field */}
      {showCustomInput && (
        <div className="mt-4">
          <textarea
            value={customText}
            onChange={(e) => handleCustomTextChange(e.target.value)}
            placeholder="Type your own answer..."
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
