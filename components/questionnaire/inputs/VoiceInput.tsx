'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface VoiceInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

export default function VoiceInput({ question, value, onChange, isDarkMode }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(value + ' ' + transcript);
    };

    recognition.start();
  };

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        rows={4}
        className={`w-full px-4 py-3.5 rounded-xl resize-none transition-all duration-200 ${
          isDarkMode
            ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
            : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
        } focus:outline-none focus:border-[#B5A692]`}
      />
      {question.helpText && (
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {question.helpText}
        </p>
      )}
      {/* Voice record button */}
      <button
        type="button"
        onClick={startVoiceRecording}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 text-white'
            : isDarkMode
              ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600 hover:bg-[#3a3a3a]'
              : 'bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        {isRecording ? 'Recording...' : 'Record'}
      </button>
    </div>
  );
}
