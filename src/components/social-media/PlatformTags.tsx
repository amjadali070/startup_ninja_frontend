import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { usePost } from './PostContext';
import { PLATFORM_LIST } from '../../constants/platforms';


const PlatformTags: React.FC = () => {
  const { postData, updateSelectedPlatforms } = usePost();

  const platforms = PLATFORM_LIST;

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = postData.selectedPlatforms;
    const newPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter(id => id !== platformId)
      : [...currentPlatforms, platformId];
    
    updateSelectedPlatforms(newPlatforms);
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {platforms.map((platform) => {
        const isSelected = postData.selectedPlatforms.includes(platform.id);
        const IconComponent = platform.icon;
        
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`relative flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2.5 rounded-xl border transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
              isSelected
                ? `${platform.colors.selectedBg} ${platform.colors.selectedBorder} ${platform.colors.textColor}`
                : `${platform.colors.unselectedBg} ${platform.colors.unselectedBorder} ${platform.colors.textColor}/70 hover:${platform.colors.textColor} hover:${platform.colors.selectedBorder}`
            }`}
          >
            {/* Checkmark icon for selected platforms */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-green-600 rounded-full flex items-center justify-center">
                <FaCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            
            <IconComponent className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${platform.colors.iconColor} ${isSelected ? 'opacity-100' : 'opacity-70'}`} />
            <span className="text-xs sm:text-sm md:text-base font-medium">{platform.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformTags;