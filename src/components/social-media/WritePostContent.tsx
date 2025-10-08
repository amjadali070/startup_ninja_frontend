import React from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { usePost } from './PostContext';

const WritePostContent: React.FC = () => {
  const { postData, updateContent } = usePost();
  const maxCharacters = 280;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      updateContent(value);
    }
  };

  const handleEnhanceWithAI = () => {
    console.log('Enhance with AI clicked');
  };

  const handleWriteWithAI = () => {
    console.log('Write with AI clicked');
  };

  return (
    <div className="bg-[#1E1E1E] border border-gray-600 rounded-xl p-3 md:p-4">
      <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-plus-jakarta">
        Write Post Content
      </h3>

      <div className="mb-3 md:mb-4">
        <textarea
          value={postData.content}
          onChange={handleContentChange}
          placeholder="What's on your mind? Let AI help you craft the perfect post..."
          className="w-full h-24 md:h-20 bg-transparent border-none outline-none resize-none 
                     text-white placeholder-gray-400 text-sm md:text-base leading-relaxed
                     focus:outline-none"
          rows={4}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEnhanceWithAI}
            className="inline-flex items-center gap-1.5 
                       bg-[#1E1E1E] border-2 border-red-600 
                       hover:bg-red-600/10 
                       text-white 
                       px-3 py-2 md:px-4 md:py-2.5
                       rounded-lg 
                       text-xs md:text-sm
                       font-medium 
                       transition-all duration-200
                       min-h-[36px] md:min-h-[40px]"
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            <span>Enhance with AI</span>
          </button>

          <button
            onClick={handleWriteWithAI}
            className="inline-flex items-center gap-1.5
                       bg-[#1E1E1E] border border-gray-500 
                       hover:bg-gray-700/20 
                       text-white 
                       px-3 py-2 md:px-4 md:py-2.5
                       rounded-lg 
                       text-xs md:text-sm
                       font-medium 
                       transition-all duration-200
                       min-h-[36px] md:min-h-[40px]"
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            <span>Write with AI</span>
          </button>
        </div>

        <div className="text-gray-400 text-xs md:text-sm font-medium">
          {postData.content.length}/{maxCharacters} characters
        </div>
      </div>
    </div>
  );
};

export default WritePostContent;