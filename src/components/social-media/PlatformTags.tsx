import React from 'react';
import { FaFacebookF, FaInstagram, FaCheck } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { usePost } from './PostContext';
import { FiLinkedin } from "react-icons/fi";


const PlatformTags: React.FC = () => {
  const { postData, updateSelectedPlatforms } = usePost();

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      unselectedBg: 'bg-[#1877F2]/10',
      selectedBg: 'bg-gradient-to-r from-[#1877F2] to-[#0b5bd3] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#1877F2]/30',
      selectedBorder: 'border-[#0b5bd3]/80',
      iconColor: 'text-white',
      textColor: 'text-white'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      unselectedBg: 'bg-gradient-to-br from-[#E4405F]/10 to-[#F77737]/10',
      selectedBg: 'bg-gradient-to-r from-[#E4405F] via-[#F77737] to-[#7B2CBF] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#E4405F]/30',
      selectedBorder: 'border-white/30',
      iconColor: 'text-white',
      textColor: 'text-white'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      icon: FaXTwitter,
      unselectedBg: 'bg-white/10',
      selectedBg: 'bg-[#1DA1F2] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-white/30',
      selectedBorder: 'border-[#1590d8]/80',
      iconColor: 'text-white',
      textColor: 'text-white'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FiLinkedin,
      unselectedBg: 'bg-[#0A66C2]/10',
      selectedBg: 'bg-gradient-to-r from-[#0A66C2] to-[#004182] shadow-[inset_0_-8px_24px_rgba(0,0,0,0.35)]',
      unselectedBorder: 'border-[#0A66C2]/30',
      selectedBorder: 'border-[#004182]/80',
      iconColor: 'text-white',
      textColor: 'text-white'
    }
  ];

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
            className={`relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full border transition-all duration-200 min-h-[40px] ${
              isSelected
                ? `${platform.selectedBg} ${platform.selectedBorder} ${platform.textColor}`
                : `${platform.unselectedBg} ${platform.unselectedBorder} ${platform.textColor}/70 hover:${platform.textColor} hover:${platform.selectedBorder}`
            }`}
          >
            {/* Checkmark icon for selected platforms */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-green-600 rounded-full flex items-center justify-center">
                <FaCheck className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            
            <IconComponent className={`w-4 h-4 ${platform.iconColor} ${isSelected ? 'opacity-100' : 'opacity-70'}`} />
            <span className="text-sm md:text-base font-medium">{platform.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformTags;