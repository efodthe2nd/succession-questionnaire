'use client';

import { Question } from '@/lib/questions';
import { useState } from 'react';

interface Props {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

export default function QuestionInput({ question, value, onChange }: Props) {
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

  if (question.type === 'dropdown') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border rounded"
      >
        <option value="">Select an option</option>
        {question.options?.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (question.type === 'textarea' || question.type === 'voice') {
    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border rounded min-h-[150px]"
        />
        {question.voiceEnabled && (
          <button
            type="button"
            onClick={startVoiceRecording}
            className={`px-4 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {isRecording ? 'Recording...' : '🎤 Voice Input'}
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border rounded"
    />
  );
}
