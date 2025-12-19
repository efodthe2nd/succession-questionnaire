'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface SpouseSectionInputProps {
  question: Question;
  isDarkMode: boolean;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
}

export default function SpouseSectionInput({
  question,
  isDarkMode,
  answers,
  onAnswerChange,
}: SpouseSectionInputProps) {
  const [isRecording, setIsRecording] = useState<string | null>(null);

  // Spouse type options
  const spouseTypeOptions = [
    'Husband',
    'Wife',
    'Partner',
    'Spouse',
    'Soulmate',
    'Dear Friend',
    'Boyfriend',
    'Girlfriend',
  ];

  // Derive number of spouses from answers
  const getSpouseCount = () => {
    let maxIndex = -1;
    const prefix = 'q3_spouse_';

    Object.keys(answers).forEach((key) => {
      if (key.startsWith(prefix)) {
        const match = key.match(/q3_spouse_(\d+)_/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (index > maxIndex) maxIndex = index;
        }
      }
    });

    // If no spouses exist yet, start with 1
    return maxIndex + 1 || 1;
  };

  const [spouseCount, setSpouseCount] = useState(getSpouseCount);

  const addSpouse = () => {
    const newIndex = spouseCount;
    // Initialize empty values for new spouse
    onAnswerChange(`q3_spouse_${newIndex}_select`, '');
    setSpouseCount(spouseCount + 1);
  };

  const startVoiceRecording = (fieldId: string, currentValue: string) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(fieldId);
    recognition.onend = () => setIsRecording(null);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onAnswerChange(fieldId, currentValue + ' ' + transcript);
    };

    recognition.start();
  };

  const renderSpouseEntry = (index: number) => {
    const selectId = `q3_spouse_${index}_select`;
    const nameId = `q3_spouse_${index}_name`;
    const storyId = `q3_spouse_${index}_story`;
    const messageId = `q3_spouse_${index}_message`;

    const selectValue = (answers[selectId] as string) || '';
    const nameValue = (answers[nameId] as string) || '';
    const storyValue = (answers[storyId] as string) || '';
    const messageValue = (answers[messageId] as string) || '';

    return (
      <div key={index} className={`space-y-6 ${index > 0 ? 'pt-8 border-t ' + (isDarkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}>
        {/* Spouse Type Select */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Who would you like to mention in your letter:
          </label>
          <select
            value={selectValue}
            onChange={(e) => onAnswerChange(selectId, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 appearance-none cursor-pointer ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          >
            <option value="">Select the best answer</option>
            {spouseTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Significant Other's Name */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Their name:
          </label>
          <input
            type="text"
            value={nameValue}
            onChange={(e) => onAnswerChange(nameId, e.target.value)}
            placeholder="say it in your own words"
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          />
        </div>

        {/* How You Met */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What is memorable about how you met your significant other?
          </label>
          <div className="relative">
            <input
              type="text"
              value={storyValue}
              onChange={(e) => onAnswerChange(storyId, e.target.value)}
              placeholder="say it in your own words. Voice-to-text highly recommended."
              className={`w-full px-4 py-3 pr-12 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                  : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
              } focus:outline-none focus:border-[#B5A692]`}
            />
            <button
              type="button"
              onClick={() => startVoiceRecording(storyId, storyValue)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                isRecording === storyId
                  ? 'bg-red-500 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                    : 'text-gray-400 hover:text-black hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message to Significant Other */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What do you want for your significant other to know, whether you've told them before or not?
          </label>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            One Succession Story writer shared, "I wasn't always great at expressing it, but you were my home. That night we sat on the couch doing nothing, not talking, just together...that's when I realized how safe I felt with you."
          </p>
          <div className="relative">
            <textarea
              value={messageValue}
              onChange={(e) => onAnswerChange(messageId, e.target.value)}
              placeholder="say it in your own words"
              rows={3}
              className={`w-full px-4 py-3.5 pr-12 rounded-xl resize-none transition-all duration-200 ${
                isDarkMode
                  ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                  : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
              } focus:outline-none focus:border-[#B5A692]`}
            />
            <button
              type="button"
              onClick={() => startVoiceRecording(messageId, messageValue)}
              className={`absolute right-3 top-3.5 p-2 rounded-full transition-all duration-200 ${
                isRecording === messageId
                  ? 'bg-red-500 text-white'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                    : 'text-gray-400 hover:text-black hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Your Significant Other
        </h2>
      </div>

      {/* Render all spouses */}
      {Array.from({ length: spouseCount }, (_, index) => renderSpouseEntry(index))}

      {/* Add Another Significant Other Button */}
      <button
        type="button"
        onClick={addSpouse}
        className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
          isDarkMode
            ? 'border-gray-700 text-gray-500 bg-transparent hover:border-gray-600 hover:text-gray-400'
            : 'border-gray-300 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-500'
        }`}
      >
        + Add another significant other
      </button>
    </div>
  );
}
