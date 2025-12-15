import React, { useState } from 'react';
import { GiNinjaStar } from "react-icons/gi";
import { imageGenService } from "../../services/imageGenService";
import { toast } from "react-hot-toast";

interface CreateImagesProps {
  onImageGenerated?: () => void;
}

const CreateImages: React.FC<CreateImagesProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('photorealistic');

  const maxCharacters = 4000; // Updated to match backend limit

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      await imageGenService.generateImage({
        prompt,
        aspectRatio,
        style
      });
      toast.success("Image generated successfully!");
      setPrompt('');
      if (onImageGenerated) {
        onImageGenerated();
      }
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Allow typing and pasting by truncating to max limit
    setPrompt(value.slice(0, maxCharacters));
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

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
          <div className="w-full sm:w-auto">
            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Aspect Ratio</label>
            <select 
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full sm:w-auto bg-[#0D0D0D] text-white/70 border border-[#242424] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
            >
              <option value="1:1">Square (1:1)</option>
              <option value="16:9">Widescreen (16:9)</option>
              <option value="4:3">Standard (4:3)</option>
              <option value="3:4">Portrait (3:4)</option>
              <option value="9:16">Story (9:16)</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-xs text-gray-400 mb-1.5 ml-1">Art Style</label>
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full sm:w-auto bg-[#0D0D0D] text-white/70 border border-[#242424] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#DC2626] transition-colors"
            >
              <option value="photorealistic">Photorealistic</option>
              <option value="anime">Anime</option>
              <option value="digital-art">Digital Art</option>
              <option value="oil-painting">Oil Painting</option>
              <option value="sketch">Sketch</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>
        </div>

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
            rows={4}
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
            className={`w-full sm:w-auto inline-flex items-center justify-center 
              gap-2 
              px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3.5 
              bg-[#DE0500] 
              hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C]
              text-white 
              text-xs sm:text-sm lg:text-sm 
              font-medium 
              rounded-lg
              transition-all duration-200
              ${(!prompt.trim() || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <GiNinjaStar className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" />
            )}
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
