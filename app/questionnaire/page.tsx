'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { questions, sections, getQuestionsBySection, getSectionByIndex } from '@/lib/questions';

export default function QuestionnairePage() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const router = useRouter();
  const supabase = createClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        if (!dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const currentSection = getSectionByIndex(currentSectionIndex);
  const currentQuestions = getQuestionsBySection(currentSectionIndex);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingSubmission) {
        setSubmissionId(existingSubmission.id);
        setCurrentSectionIndex(existingSubmission.current_section_index || 1);

        const { data: existingAnswers } = await supabase
          .from('answers')
          .select('*')
          .eq('submission_id', existingSubmission.id);

        const answersMap: Record<string, string | string[]> = {};
        existingAnswers?.forEach((a) => {
          try {
            answersMap[a.question_id] = JSON.parse(a.answer_text);
          } catch {
            answersMap[a.question_id] = a.answer_text;
          }
        });
        setAnswers(answersMap);
      } else {
        const { data: newSubmission } = await supabase
          .from('submissions')
          .insert({ user_id: user.id, current_section_index: 1 })
          .select()
          .single();
        setSubmissionId(newSubmission?.id);
      }
      setIsLoading(false);
    };
    init();
  }, [router, supabase]);

  const saveAnswer = async (questionId: string, value: string | string[]) => {
    if (!submissionId) return;
    setAnswers({ ...answers, [questionId]: value });
    
    const answerText = typeof value === 'string' ? value : JSON.stringify(value);
    await supabase.from('answers').upsert({
      submission_id: submissionId,
      question_id: questionId,
      answer_text: answerText,
    });
  };

  const handleNext = async () => {
    if (currentSectionIndex < sections.length) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      await supabase
        .from('submissions')
        .update({ current_section_index: newIndex })
        .eq('id', submissionId);
    } else {
      await supabase
        .from('submissions')
        .update({ status: 'completed', submitted_at: new Date().toISOString() })
        .eq('id', submissionId);
      router.push('/thank-you');
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 1) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else {
      router.push('/');
    }
  };

  const goToSection = (index: number) => {
    setCurrentSectionIndex(index);
    setShowProgressModal(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#F5F5F5]'}`}>
        <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#F5F5F5]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 px-4 py-4 flex items-center justify-between ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {currentSection?.title}
        </span>
        <div className="flex items-center gap-4">
          {/* Dark/Light mode toggle */}
          <button onClick={toggleDarkMode} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            {isDarkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          {/* Save icon */}
          <button className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
          {/* Back/Close */}
          <button onClick={handleBack} className={`${isDarkMode ? 'text-white' : 'text-black'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Section Indicator / Progress Dropdown */}
      <div className={`px-4 py-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <button 
          onClick={() => setShowProgressModal(true)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Circular number badge */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${isDarkMode ? 'bg-[#B5A692] text-black' : 'bg-[#B5A692] text-white'}`}>
              {currentSectionIndex}
            </div>
            <div className="text-left">
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {currentSection?.title}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Step {currentSectionIndex} of {sections.length}
              </p>
            </div>
          </div>
          {/* Dropdown arrow */}
          <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Questions */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-6">
          {currentQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              {/* Question Text */}
              <label className={`block font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {question.text}
              </label>
              {/* Question Label/Subtitle */}
              {question.label && (
                <p className={`text-sm ${isDarkMode ? 'text-[#B5A692]' : 'text-[#8B7355]'}`}>
                  {question.label}
                </p>
              )}

              {/* Input based on type */}
              {question.type === 'dropdown' && (
                <div 
                  className="relative"
                  ref={(el) => { dropdownRefs.current[question.id] = el; }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === question.id ? null : question.id)}
                    className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center justify-between transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600' 
                        : 'bg-white text-black border border-gray-300 hover:border-gray-400'
                    } focus:outline-none focus:border-[#B5A692]`}
                  >
                    <span className={!answers[question.id] ? (isDarkMode ? 'text-gray-500' : 'text-gray-400') : ''}>
                      {(answers[question.id] as string) || question.placeholder || 'Select'}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${openDropdown === question.id ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Custom Dropdown Menu */}
                  <div 
                    className={`absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 transition-all duration-200 ease-out origin-top ${
                      openDropdown === question.id 
                        ? 'opacity-100 scale-y-100 translate-y-0' 
                        : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                    } ${
                      isDarkMode 
                        ? 'bg-[#2a2a2a] border border-gray-700 shadow-lg shadow-black/30' 
                        : 'bg-white border border-gray-200 shadow-lg shadow-black/10'
                    }`}
                    style={{ maxHeight: '200px' }}
                  >
                    <div className="overflow-y-auto max-h-[200px] py-1">
                      {question.options?.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            saveAnswer(question.id, option);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-4 py-3 text-left transition-colors duration-150 ${
                            answers[question.id] === option
                              ? isDarkMode 
                                ? 'bg-[#B5A692]/20 text-[#B5A692]' 
                                : 'bg-[#B5A692]/20 text-[#8B7355]'
                              : isDarkMode 
                                ? 'text-white hover:bg-[#3a3a3a]' 
                                : 'text-black hover:bg-gray-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  value={(answers[question.id] as string) || ''}
                  onChange={(e) => saveAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className={`w-full px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600' 
                      : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
                  } focus:outline-none focus:border-[#B5A692]`}
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={(answers[question.id] as string) || ''}
                  onChange={(e) => saveAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  rows={4}
                  className={`w-full px-4 py-3.5 rounded-xl resize-none transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600' 
                      : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
                  } focus:outline-none focus:border-[#B5A692]`}
                />
              )}

              {question.type === 'multiselect' && (
                <div 
                  className="relative"
                  ref={(el) => { dropdownRefs.current[question.id] = el; }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === question.id ? null : question.id)}
                    className={`w-full px-4 py-3.5 rounded-xl text-left flex items-center justify-between transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600' 
                        : 'bg-white text-black border border-gray-300 hover:border-gray-400'
                    } focus:outline-none focus:border-[#B5A692]`}
                  >
                    <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                      {question.placeholder || 'Select'}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${openDropdown === question.id ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Custom Dropdown Menu */}
                  <div 
                    className={`absolute left-0 right-0 mt-2 rounded-xl overflow-hidden z-20 transition-all duration-200 ease-out origin-top ${
                      openDropdown === question.id 
                        ? 'opacity-100 scale-y-100 translate-y-0' 
                        : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                    } ${
                      isDarkMode 
                        ? 'bg-[#2a2a2a] border border-gray-700 shadow-lg shadow-black/30' 
                        : 'bg-white border border-gray-200 shadow-lg shadow-black/10'
                    }`}
                    style={{ maxHeight: '200px' }}
                  >
                    <div className="overflow-y-auto max-h-[200px] py-1">
                      {question.options?.map((option) => {
                        const isSelected = ((answers[question.id] as string[]) || []).includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const currentValues = (answers[question.id] as string[]) || [];
                              if (isSelected) {
                                saveAnswer(question.id, currentValues.filter(v => v !== option));
                              } else {
                                saveAnswer(question.id, [...currentValues, option]);
                              }
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors duration-150 ${
                              isSelected
                                ? isDarkMode 
                                  ? 'bg-[#B5A692]/20 text-[#B5A692]' 
                                  : 'bg-[#B5A692]/20 text-[#8B7355]'
                                : isDarkMode 
                                  ? 'text-white hover:bg-[#3a3a3a]' 
                                  : 'text-black hover:bg-gray-100'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isSelected 
                                ? 'bg-[#B5A692] border-[#B5A692]' 
                                : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Selected tags */}
                  {((answers[question.id] as string[]) || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {((answers[question.id] as string[]) || []).map((val) => (
                        <span 
                          key={val} 
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-150 ${
                            isDarkMode ? 'bg-[#B5A692] text-black' : 'bg-[#B5A692] text-white'
                          }`}
                        >
                          {val.length > 20 ? val.substring(0, 20) + '...' : val}
                          <button
                            type="button"
                            onClick={() => {
                              const currentValues = (answers[question.id] as string[]) || [];
                              saveAnswer(question.id, currentValues.filter(v => v !== val));
                            }}
                            className="ml-1 hover:opacity-70 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {question.type === 'voice' && (
                <div className="space-y-3">
                  <textarea
                    value={(answers[question.id] as string) || ''}
                    onChange={(e) => saveAnswer(question.id, e.target.value)}
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600 hover:bg-[#3a3a3a]' 
                        : 'bg-white text-black border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Record
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <div className={`mx-4 mb-4 rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-[#E8E4DC]'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Succession Story Questionaire
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A Short Guide to Help You Express Your Values
              </p>
            </div>
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button className={`w-full py-3 flex items-center justify-center gap-2 text-sm ${
          isDarkMode 
            ? 'bg-[#3a3a3a] text-gray-300 border-t border-gray-700' 
            : 'bg-[#D8D4CC] text-gray-600 border-t border-gray-300'
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>
      </div>

      {/* Next Button */}
      <div className="px-4 pb-6">
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors ${
            isDarkMode 
              ? 'bg-[#E8E4DC] text-black hover:bg-[#D8D4CC]' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {currentSectionIndex === sections.length ? 'Submit' : 'Next'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop with fade animation */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowProgressModal(false)}
          />
          
          {/* Modal with slide-up animation */}
          <div 
            className={`relative w-full max-h-[75vh] rounded-t-3xl overflow-hidden transition-all duration-300 ease-out transform ${
              isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
            }`}
            style={{
              boxShadow: isDarkMode 
                ? '0 -8px 30px rgba(0, 0, 0, 0.4), 0 -2px 10px rgba(0, 0, 0, 0.2)' 
                : '0 -8px 30px rgba(0, 0, 0, 0.15), 0 -2px 10px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className={`w-10 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>
            
            {/* Header */}
            <div className={`sticky top-0 flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#1a1a1a]' : 'border-gray-200 bg-white'}`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Your Progress
              </h3>
              <button 
                onClick={() => setShowProgressModal(false)}
                className={`p-2 rounded-full transition-colors duration-150 ${
                  isDarkMode 
                    ? 'text-white hover:bg-gray-800' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Section List */}
            <div className="overflow-y-auto max-h-[60vh] px-4 py-3">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(section.id)}
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-150 ${
                      section.id === currentSectionIndex
                        ? isDarkMode 
                          ? 'bg-[#2a2a2a] border border-gray-700' 
                          : 'bg-gray-100 border border-gray-200'
                        : isDarkMode
                          ? 'hover:bg-[#252525]'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Step {section.id}
                    </p>
                    <p className={`font-medium mt-0.5 ${
                      section.id === currentSectionIndex
                        ? 'text-[#B5A692]'
                        : isDarkMode ? 'text-white' : 'text-black'
                    }`}>
                      {section.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}