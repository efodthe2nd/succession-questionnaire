'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Question } from '@/lib/questions';
import { useWhisper } from '@/hooks/useWhisper';

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
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const pendingChangeRef = useRef<{ id: string; handler: (val: string) => void; currentValue: string } | null>(null);

  // Whisper hook
  const {
    isRecording,
    isTranscribing,
    isModelLoading,
    isModelReady,
    modelLoadProgress,
    error,
    startRecording,
    stopRecording,
    loadModel,
  } = useWhisper({
    onTranscript: (transcript) => {
      if (pendingChangeRef.current) {
        const { currentValue, handler } = pendingChangeRef.current;
        // Append to existing text
        const newValue = currentValue.trim()
          ? `${currentValue.trim()} ${transcript}`
          : transcript;
        handler(newValue);
      }
    },
  });

  // Preload model on mount for better UX
  useEffect(() => {
    // Delay model loading slightly to not block initial render
    const timer = setTimeout(() => {
      loadModel();
    }, 2000);
    return () => clearTimeout(timer);
  }, [loadModel]);

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

  const handleStartRecording = useCallback(async (
    storyId: string,
    currentValue: string,
    onChangeHandler: (val: string) => void
  ) => {
    setActiveStoryId(storyId);
    pendingChangeRef.current = {
      id: storyId,
      handler: onChangeHandler,
      currentValue,
    };
    await startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    await stopRecording();
    setActiveStoryId(null);
  }, [stopRecording]);

  // Check if this is the first story (has subtitle) or subsequent stories
  const isFirstStory = !!question.subtitle;

  const renderStoryInput = (
    storyId: string,
    storyTitle: string,
    storyValue: string,
    onStoryChange: (val: string) => void
  ) => {
    const isCurrentlyRecording = isRecording && activeStoryId === storyId;
    const isCurrentlyTranscribing = isTranscribing && activeStoryId === storyId;

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
          <button
            type="button"
            onClick={() =>
              isCurrentlyRecording
                ? handleStopRecording()
                : handleStartRecording(storyId, storyValue, onStoryChange)
            }
            disabled={isModelLoading || isCurrentlyTranscribing}
            className={`absolute right-3 top-3.5 p-2 rounded-full transition-all duration-200 ${
              isCurrentlyRecording
                ? 'bg-red-500 text-white animate-pulse'
                : isCurrentlyTranscribing
                  ? 'bg-yellow-500 text-white'
                  : isModelLoading
                    ? 'text-gray-500 cursor-wait'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                      : 'text-gray-400 hover:text-black hover:bg-gray-100'
            }`}
            title={
              isCurrentlyRecording
                ? 'Stop recording'
                : isCurrentlyTranscribing
                  ? 'Transcribing...'
                  : isModelLoading
                    ? `Loading speech model (${modelLoadProgress}%)`
                    : 'Start recording'
            }
          >
            {isCurrentlyRecording ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : isCurrentlyTranscribing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        {/* Status messages */}
        {isCurrentlyRecording && (
          <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Recording... Click stop when finished.
          </p>
        )}
        {isCurrentlyTranscribing && (
          <p className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            Transcribing your audio...
          </p>
        )}
        {error && activeStoryId === storyId && (
          <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
            {error}
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

      {/* Model loading indicator */}
      {isModelLoading && (
        <div className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading speech recognition ({modelLoadProgress}%)...
        </div>
      )}

      {/* Subtitle - Intro text before prompts */}
      {question.subtitle && (
        <div className={`space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {question.subtitle.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-sm leading-relaxed font-semibold">
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
