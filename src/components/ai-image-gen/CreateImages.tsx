import React, { useState } from 'react';
import { RiAiGenerate2 } from "react-icons/ri";
import { GiNinjaStar } from "react-icons/gi";


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
    <div className="w-full max-w-auto mx-auto">
      {/* Main Container - Consistent with project patterns */}
      <div className="relative w-full 
        rounded-xl border border-[#242424] bg-[#151515] 
        p-2.5 sm:p-3 lg:p-4 xl:p-5 
        shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg">
        
        {/* Title */}
        <h1 className="text-white 
          text-base sm:text-lg md:text-xl lg:text-[24px] 
          font-bold 
          mb-2 sm:mb-3 lg:mb-6 
          leading-tight font-plus-jakarta">
          Create Images
        </h1>

        {/* Text Area Container */}
        <div className="relative bg-[#0D0D0D] rounded-xl">
          <textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder="What's on your mind? Let AI help you craft the perfect image..."
            className="w-full 
              min-h-[100px] sm:min-h-[100px] 
              bg-transparent 
              rounded-xl 
              p-4 sm:p-4
              text-white/70
              text-base leading-6 
              placeholder:text-white/25 
              resize-none 
              focus:outline-none focus:border-[#DC2626] 
              transition-colors duration-200"
            rows={6}
          />
          
          {/* Character Count */}
          <div className="absolute 
            bottom-3 right-3 
            text-white/45 
            text-xs 
            font-medium">
            {prompt.length} / {maxCharacters} characters
          </div>
        </div>

        {/* Generate Buttons - Consistent with project patterns */}
        <div className="flex justify-start gap-3 mt-6">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="inline-flex items-center justify-center 
              gap-2 
              px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 
              bg-[#DE0500] 
              hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C]
              text-white 
              text-xs sm:text-sm lg:text-sm 
              font-medium 
              rounded-lg
              transition-all duration-200"
          >
            <GiNinjaStar className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </span>
          </button>

          <button
            onClick={() => {/* TODO: Implement generate prompt logic */}}
            disabled={isGenerating}
            className="inline-flex items-center justify-center 
              gap-2 
              px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 
              bg-[#FFFFF010] 
              hover:bg-[#FFFFF010]/10 
              disabled:bg-[#666666] disabled:border-[#666666] disabled:cursor-not-allowed 
              text-[white] hover:text-white 
              text-xs sm:text-sm lg:text-sm 
              font-medium 
              rounded-lg
              transition-all duration-200"
          >
            <RiAiGenerate2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" />
            <span className="whitespace-nowrap">
              Generate Prompt
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateImages;