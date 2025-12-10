'use client';

import { useState, useRef, useEffect } from 'react';
import { Question } from '@/lib/questions';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
}

export default function VoiceInput({ question, value, onChange, isDarkMode }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startVoiceRecording = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setInterimTranscript('');

      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access to use voice input.');
      } else if (event.error === 'no-speech') {
        // Silent failure for no speech detected
      } else {
        alert(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript) {
        const newValue = value.trim() ? `${value.trim()} ${finalTranscript.trim()}` : finalTranscript.trim();
        onChange(newValue);
      }

      setInterimTranscript(interim);
    };

    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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

      {/* Interim transcript preview */}
      {interimTranscript && (
        <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {interimTranscript}
        </p>
      )}

      {/* Subtitle - main instruction text */}
      {question.subtitle && (
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {question.subtitle}
        </p>
      )}

      {/* Help text - examples with proper formatting */}
      {question.helpText && (
        <div className={`text-xs space-y-3 mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {question.helpText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Voice record button */}
      {isSupported ? (
        <button
          type="button"
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600 hover:bg-[#3a3a3a]'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {isRecording ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
          {isRecording ? 'Stop Recording' : 'Record'}
        </button>
      ) : (
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.
        </p>
      )}
    </div>
  );
}
