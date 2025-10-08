import React, { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';

const CreateImages: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const maxCharacters = 280;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    // TODO: Implement image generation logic
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setPrompt(value);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Container - Compact like AIChatComposer */}
      <div className="relative w-full 
        rounded-2xl border border-[#242424] bg-[#151515] 
        p-2 sm:p-4 md:p-5 
        shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg">
        
        {/* Title */}
        <h1 className="text-white 
          text-lg sm:text-xl md:text-2xl 
          font-semibold 
          mb-3 sm:mb-4 md:mb-5 
          leading-tight font-plus-jakarta">
          Create Images
        </h1>

        {/* Text Area Container */}
        <div className="relative mb-3 sm:mb-4">
          <textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder="What's on your mind? Let AI help you craft the perfect image..."
            className="w-full 
              min-h-[70px] sm:min-h-[100px] md:min-h-[120px] 
              bg-transparent 
              border border-[#242424] 
              rounded-xl 
              p-3 sm:p-4 
              text-white/70 
              text-base sm:text-lg 
              placeholder:text-white/25 
              resize-none 
              focus:outline-none focus:border-[#DC2626] 
              transition-colors duration-200 
              leading-6"
            rows={3}
          />
          
          {/* Character Count */}
          <div className="absolute 
            bottom-3 right-3 
            text-white/45 
            text-xs sm:text-sm 
            font-medium">
            {prompt.length} / {maxCharacters} characters
          </div>
        </div>

        {/* Generate Button - Compact like AIChatComposer */}
        <div className="flex justify-start">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="inline-flex items-center justify-center 
              gap-2 
              px-4 py-2.5 sm:px-5 sm:py-3 
              bg-[#DE0500] 
              hover:bg-[#B91C1C]
              disabled:bg-[#666666] disabled:cursor-not-allowed 
              text-white 
              text-sm sm:text-base 
              font-semibold 
              rounded-lg
              shadow-[0_20px_40px_rgba(222,5,0,0.45)]
              hover:scale-105
              disabled:hover:scale-100
              transition-all duration-200"
          >
            <FaWandMagicSparkles className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateImages;