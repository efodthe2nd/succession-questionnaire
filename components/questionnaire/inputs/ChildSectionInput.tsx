'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface ChildSectionInputProps {
  question: Question;
  isDarkMode: boolean;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
}

export default function ChildSectionInput({
  question,
  isDarkMode,
  answers,
  onAnswerChange,
}: ChildSectionInputProps) {
  const [isRecording, setIsRecording] = useState<string | null>(null);

  // Child wishes options
  const wishesOptions = [
    'you find true happiness.',
    'you always follow your dreams.',
    'you remain kind and generous.',
    'you build strong, loving relationships.',
    'you stay connected with siblings and cousins.',
    'you create a family history book.',
    'you find the love of your life.',
  ];

  // Derive number of children from answers
  const getChildCount = () => {
    let maxIndex = -1;
    const prefix = 'q3_child_';

    Object.keys(answers).forEach((key) => {
      if (key.startsWith(prefix)) {
        const match = key.match(/q3_child_(\d+)_/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (index > maxIndex) maxIndex = index;
        }
      }
    });

    // If no children exist yet, start with 1
    return maxIndex + 1 || 1;
  };

  const [childCount, setChildCount] = useState(getChildCount);

  const addChild = () => {
    const newIndex = childCount;
    // Initialize empty values for new child
    onAnswerChange(`q3_child_${newIndex}_name`, '');
    setChildCount(childCount + 1);
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

  const renderChildEntry = (index: number) => {
    const nameId = `q3_child_${index}_name`;
    const wishesId = `q3_child_${index}_wishes`;
    const messageId = `q3_child_${index}_message`;

    const nameValue = (answers[nameId] as string) || '';
    const wishesValue = (answers[wishesId] as string) || '';
    const messageValue = (answers[messageId] as string) || '';

    return (
      <div key={index} className={`space-y-6 ${index > 0 ? 'pt-8 border-t ' + (isDarkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}>
        {/* Child Header */}
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Child {index + 1}
        </h3>

        {/* Child's Name */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What is your child's name?
          </label>
          <input
            type="text"
            value={nameValue}
            onChange={(e) => onAnswerChange(nameId, e.target.value)}
            placeholder="Type Here"
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          />
        </div>

        {/* Wishes for Child */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What are your wishes for your child?
          </label>
          <select
            value={wishesValue}
            onChange={(e) => onAnswerChange(wishesId, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 appearance-none cursor-pointer ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          >
            <option value="">Select</option>
            {wishesOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Message to Child */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What do you want for your child to know, whether you've told them before or not?
          </label>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            One Succession Story writer shared, "That time when you were in middle school and you tried to microwave an entire egg and it exploded all over the ceiling. You looked up, covered in yolk, and said, 'So... science is dangerous.' I still laugh when I clean that spot."
          </p>
          <div className="relative">
            <textarea
              value={messageValue}
              onChange={(e) => onAnswerChange(messageId, e.target.value)}
              placeholder="Type Here!"
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
          Your Children
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Tell us about your children
        </p>
      </div>

      {/* Render all children */}
      {Array.from({ length: childCount }, (_, index) => renderChildEntry(index))}

      {/* Add Another Child Button */}
      <button
        type="button"
        onClick={addChild}
        className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
          isDarkMode
            ? 'border-gray-700 text-gray-500 bg-transparent hover:border-gray-600 hover:text-gray-400'
            : 'border-gray-300 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-500'
        }`}
      >
        + Add another child
      </button>
    </div>
  );
}
