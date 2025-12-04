'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

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
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingId(storyId);
    };
    recognition.onend = () => {
      setIsRecording(false);
      setRecordingId(null);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChangeHandler(currentValue + ' ' + transcript);
    };

    recognition.start();
  };

  // Check if this is the first story (has subtitle) or subsequent stories
  const isFirstStory = !!question.subtitle;

  const renderStoryInput = (
    storyId: string,
    storyTitle: string,
    storyValue: string,
    onStoryChange: (val: string) => void
  ) => (
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
          placeholder={question.placeholder || 'Type Here!'}
          rows={3}
          className={`w-full px-4 py-3.5 pr-12 rounded-xl resize-none transition-all duration-200 ${
            isDarkMode
              ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
              : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
          } focus:outline-none focus:border-[#B5A692]`}
        />
        <button
          type="button"
          onClick={() => startVoiceRecording(storyId, storyValue, onStoryChange)}
          className={`absolute right-3 top-3.5 p-2 rounded-full transition-all duration-200 ${
            isRecording && recordingId === storyId
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
  );

  return (
    <div className="space-y-6">
      {/* Main Headline - Only show for first story */}
      {isFirstStory && (
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {question.text}
        </h2>
      )}

      {/* Subtitle - Long descriptive text (only for first story) */}
      {question.subtitle && (
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {question.subtitle.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Main Story Input */}
      {renderStoryInput(
        question.id,
        question.storyTitle || question.text,
        value,
        onChange
      )}

      {/* Prompts as bullet list */}
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
