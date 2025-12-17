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

interface StoryInputProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  onAddStory?: (questionId: string) => void;
  answers?: Record<string, string | string[]>;
  onAnswerChange?: (questionId: string, value: string) => void;
}

export default function StoryInput({
  question,
  value,
  onChange,
  isDarkMode,
  onAddStory,
  answers = {},
  onAnswerChange,
}: StoryInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
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

  // Derive additional stories from answers
  const getAdditionalStories = () => {
    const additionalStories: { id: string; index: number; value: string }[] = [];
    const prefix = `${question.id}_additional_`;

    Object.keys(answers).forEach((key) => {
      if (key.startsWith(prefix)) {
        const index = parseInt(key.replace(prefix, ''), 10);
        if (!isNaN(index)) {
          additionalStories.push({
            id: key,
            index,
            value: (answers[key] as string) || '',
          });
        }
      }
    });

    // Sort by index
    return additionalStories.sort((a, b) => a.index - b.index);
  };

  const additionalStories = getAdditionalStories();

  const startVoiceRecording = (storyId: string, currentValue: string, onChangeHandler: (val: string) => void) => {
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
      setRecordingId(storyId);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsRecording(false);
      setRecordingId(null);
      setInterimTranscript('');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setRecordingId(null);
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
        const newValue = currentValue.trim() ? `${currentValue.trim()} ${finalTranscript.trim()}` : finalTranscript.trim();
        onChangeHandler(newValue);
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

  // Check if this is the first story (has subtitle) or subsequent stories
  const isFirstStory = !!question.subtitle;

  const renderStoryInput = (
    storyId: string,
    storyTitle: string,
    storyValue: string,
    onStoryChange: (val: string) => void
  ) => {
    const isCurrentlyRecording = isRecording && recordingId === storyId;

    return (
      <div key={storyId} className="space-y-4">
        {/* Story Title */}
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {storyTitle}
        </h3>

        {/* Input with mic icon */}
        <div className="relative">
          <textarea
            value={storyValue}
            onChange={(e) => onStoryChange(e.target.value)}
            placeholder={question.placeholder || 'Say it in your own words. Voice-to-Text highly recommended.'}
            rows={3}
            className={`w-full px-4 py-3.5 pr-12 rounded-xl resize-none transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          />
          {isSupported && (
            <button
              type="button"
              onClick={() =>
                isCurrentlyRecording
                  ? stopVoiceRecording()
                  : startVoiceRecording(storyId, storyValue, onStoryChange)
              }
              className={`absolute right-3 top-3.5 p-2 rounded-full transition-all duration-200 ${
                isCurrentlyRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                    : 'text-gray-400 hover:text-black hover:bg-gray-100'
              }`}
              title={isCurrentlyRecording ? 'Stop recording' : 'Start recording'}
            >
              {isCurrentlyRecording ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Interim transcript preview */}
        {isCurrentlyRecording && interimTranscript && (
          <p className={`text-sm italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {interimTranscript}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Headline - Only show for first story */}
      {isFirstStory && (
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {question.text}
        </h2>
      )}

      {/* Subtitle - Intro text before prompts */}
      {question.subtitle && (
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {question.subtitle.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Prompts as bullet list - BEFORE the text box */}
      {question.storyPrompts && question.storyPrompts.length > 0 && (
        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {question.storyPrompts.map((prompt, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              <span>{prompt}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Main Story Input - AFTER the prompts */}
      {renderStoryInput(
        question.id,
        question.storyTitle || question.text,
        value,
        onChange
      )}

      {/* Additional Stories */}
      {additionalStories.map((story) => (
        renderStoryInput(
          story.id,
          `Story ${story.index + 3}`,
          story.value,
          (val) => onAnswerChange?.(story.id, val)
        )
      ))}

      {/* Add Story Button */}
      {question.allowAddMore && (
        <button
          type="button"
          onClick={() => onAddStory?.(question.id)}
          className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
            isDarkMode
              ? 'border-gray-700 text-gray-500 bg-transparent hover:border-gray-600 hover:text-gray-400'
              : 'border-gray-300 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-500'
          }`}
        >
          + Add story
        </button>
      )}
    </div>
  );
}
