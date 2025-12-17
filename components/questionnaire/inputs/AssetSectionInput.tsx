'use client';

import { useState } from 'react';
import { Question } from '@/lib/questions';

interface AssetSectionInputProps {
  question: Question;
  isDarkMode: boolean;
  answers: Record<string, string | string[]>;
  onAnswerChange: (questionId: string, value: string | string[]) => void;
}

// Asset type options
const assetOptions = [
  'any real property',
  'any cash',
  'the house',
  'the family house',
  'the rental property',
  'commercial properties',
  'my business',
  'my retirement account',
  'liquid assets',
  'my stock account',
  'my family heirloom',
  'my car',
  'my gold and silver',
];

// Guidance options
const CUSTOM_GUIDANCE = '__custom__';

const guidanceOptions = [
  'it remain in the family and never be sold.',
  'it be passed down to your children.',
  'it be used as a family vacation home.',
  'it be rented out for family expenses.',
  'it be sold and proceeds divided among heirs.',
  'it be sold only if financially necessary.',
  'it be preserved as a legacy property.',
  'it be maintained and kept in good condition.',
  'it be held in trust for future family use.',
  'it be donated to a cause I care about.',
  'it be the setting for annual family reunions.',
];

export default function AssetSectionInput({
  question,
  isDarkMode,
  answers,
  onAnswerChange,
}: AssetSectionInputProps) {
  const [isRecording, setIsRecording] = useState<string | null>(null);

  // Derive number of assets from answers
  const getAssetCount = () => {
    let maxIndex = -1;
    const prefix = 'q5_asset_';

    Object.keys(answers).forEach((key) => {
      if (key.startsWith(prefix)) {
        const match = key.match(/q5_asset_(\d+)_/);
        if (match) {
          const index = parseInt(match[1], 10);
          if (index > maxIndex) maxIndex = index;
        }
      }
    });

    // If no assets exist yet, start with 1
    return maxIndex + 1 || 1;
  };

  const [assetCount, setAssetCount] = useState(getAssetCount);

  const addAsset = () => {
    const newIndex = assetCount;
    // Initialize empty values for new asset
    onAnswerChange(`q5_asset_${newIndex}_type`, '');
    setAssetCount(assetCount + 1);
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

  const renderAssetEntry = (index: number) => {
    const typeId = `q5_asset_${index}_type`;
    const guidanceId = `q5_asset_${index}_guidance`;
    const storyId = `q5_asset_${index}_story`;

    const typeValue = (answers[typeId] as string) || '';
    const guidanceValue = (answers[guidanceId] as string) || '';
    const storyValue = (answers[storyId] as string) || '';

    return (
      <div key={index} className={`space-y-6 ${index > 0 ? 'pt-8 border-t ' + (isDarkMode ? 'border-gray-700' : 'border-gray-200') : ''}`}>
        {/* Asset Header */}
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Asset {index + 1}
        </h3>

        {/* Asset Type */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            As for:
          </label>
          <p className="text-[#B5A692] text-sm">What becomes yours after I'm gone</p>
          <select
            value={typeValue}
            onChange={(e) => onAnswerChange(typeId, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 appearance-none cursor-pointer ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          >
            <option value="">Select</option>
            {assetOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Guidance */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            What I want you to know is:
          </label>
          <p className="text-[#B5A692] text-sm">I'm placing this in your hands, in hopes that</p>
          <select
            value={guidanceValue}
            onChange={(e) => onAnswerChange(guidanceId, e.target.value)}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 appearance-none cursor-pointer ${
              isDarkMode
                ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600'
                : 'bg-white text-black border border-gray-300 hover:border-gray-400'
            } focus:outline-none focus:border-[#B5A692]`}
          >
            <option value="">Select</option>
            {guidanceOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
            <option value={CUSTOM_GUIDANCE}>Say it in your own words...</option>
          </select>
          {/* Custom guidance input */}
          {guidanceValue === CUSTOM_GUIDANCE && (
            <textarea
              value={(answers[guidanceId + '_custom'] as string) || ''}
              onChange={(e) => onAnswerChange(guidanceId + '_custom', e.target.value)}
              placeholder="Say it in your own words."
              rows={2}
              className={`w-full mt-2 px-4 py-3 rounded-xl transition-all duration-200 resize-none ${
                isDarkMode
                  ? 'bg-[#2a2a2a] text-white border border-gray-700 hover:border-gray-600 placeholder-gray-500'
                  : 'bg-white text-black border border-gray-300 hover:border-gray-400 placeholder-gray-400'
              } focus:outline-none focus:border-[#B5A692]`}
            />
          )}
        </div>

        {/* Story */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
            The story behind this gift
          </label>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Use this space to share any guidance you want to offer about the asset, the story of how you acquired it, or a memory from the time you owned it.
          </p>
          <div className="relative">
            <textarea
              value={storyValue}
              onChange={(e) => onAnswerChange(storyId, e.target.value)}
              placeholder="Say it in your own words. Voice-to-Text highly recommended."
              rows={4}
              className={`w-full px-4 py-3.5 pr-12 rounded-xl resize-none transition-all duration-200 ${
                isDarkMode
                  ? 'bg-[#2a2a2a] text-white border border-gray-700 placeholder-gray-500 hover:border-gray-600'
                  : 'bg-white text-black border border-gray-300 placeholder-gray-400 hover:border-gray-400'
              } focus:outline-none focus:border-[#B5A692]`}
            />
            <button
              type="button"
              onClick={() => startVoiceRecording(storyId, storyValue)}
              className={`absolute right-3 top-3.5 p-2 rounded-full transition-all duration-200 ${
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
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Your Assets & Gifts
        </h2>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Now is your chance to tell the story behind each gift.
        </p>
      </div>

      {/* Example quotes */}
      <div className={`text-xs space-y-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="leading-relaxed">
          One Succession Story writer said, "As for the rental property, what I want you to know is that they are a business and if you're not good at the business either partner with someone who is, or sell them smart and move on. Don't let those houses become a burden. If they're too much to manage, sell and invest the money. I once missed Thanksgiving dinner cleaning out a tenant's drain. Don't repeat that."
        </p>
        <p className="leading-relaxed">
          Another said, "As for the commercial property, what I want you to know is that your mother and I touched and improved every inch of it ourselves. We had an agent but we ended up negotiating the deal ourselves. We talked the sellers into financing it for us, and ended up being life-long partners and friends with them. We spent more time there than we did at home. Make the most of it."
        </p>
        <p className="leading-relaxed">
          Another said, "As for our home, what I want you to know is that the water shutoff is just under the hose on the left side of the house."
        </p>
        <p className="leading-relaxed">
          Another said, "As for my brokerage account, what I want you to know is that there is enough in there for you to invest most of it, and still buy yourself something nice. I noticed that you never did this. Spend $5,000 of it and splurge on something that makes you feel good. A nice piece of art, or a first class ticket, whatever you want. I want that for you."
        </p>
      </div>

      {/* Render all assets */}
      {Array.from({ length: assetCount }, (_, index) => renderAssetEntry(index))}

      {/* Add Another Asset Button */}
      <button
        type="button"
        onClick={addAsset}
        className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border ${
          isDarkMode
            ? 'border-gray-700 text-gray-500 bg-transparent hover:border-gray-600 hover:text-gray-400'
            : 'border-gray-300 text-gray-400 bg-transparent hover:border-gray-400 hover:text-gray-500'
        }`}
      >
        + Add another asset
      </button>
    </div>
  );
}
