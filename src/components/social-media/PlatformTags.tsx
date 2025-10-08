import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const PlatformTags: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'facebook', 'instagram', 'x', 'linkedin'
  ]);

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'text-[#1877F2]'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      color: 'text-[#E4405F]'
    },
    {
      id: 'x',
      name: 'X',
      icon: FaXTwitter,
      color: 'text-white'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      color: 'text-[#0A66C2]'
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {platforms.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.id);
        const IconComponent = platform.icon;
        
        return (
          <button
            key={platform.id}
            onClick={() => togglePlatform(platform.id)}
            className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg border transition-all duration-200 min-h-[40px] ${
              isSelected
                ? 'bg-[#2A2A2A] border-gray-600 text-white'
                : 'bg-transparent border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? platform.color : 'text-gray-400'}`} />
            <span className="text-sm md:text-base font-medium">{platform.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformTags;