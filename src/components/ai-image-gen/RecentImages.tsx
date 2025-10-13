import React from 'react';

const RecentImages: React.FC = () => {
  // Dummy images data - matching the ninja theme from the attached image
  const recentImages = [
    {
      id: 1,
      src: '/images/ninja-1.jpg', // We'll use placeholder for now
      alt: 'Startup Ninja Logo',
      prompt: 'Modern startup ninja logo design'
    },
    {
      id: 2,
      src: '/images/ninja-2.jpg',
      alt: 'Red Ninja Warrior',
      prompt: 'Red ninja warrior with glowing eyes'
    },
    {
      id: 3,
      src: '/images/ninja-3.jpg',
      alt: 'Ninja in Moonlight',
      prompt: 'Ninja silhouette against red moon'
    },
    {
      id: 4,
      src: '/images/ninja-4.jpg',
      alt: 'Samurai on Mountain',
      prompt: 'Samurai warrior standing on mountain peak'
    },
    {
      id: 5,
      src: '/images/ninja-5.jpg',
      alt: 'Ninja in Red Storm',
      prompt: 'Ninja warrior in red storm scene'
    },
    {
      id: 6,
      src: '/images/ninja-6.jpg',
      alt: 'Dark Ninja Silhouette',
      prompt: 'Dark ninja silhouette with red background'
    },
    {
      id: 7,
      src: '/images/ninja-7.jpg',
      alt: 'Ninja Fuel Energy Drink',
      prompt: 'Ninja fuel energy drink product design'
    },
    {
      id: 8,
      src: '/images/ninja-8.jpg',
      alt: 'Ninja Figurines',
      prompt: 'Cute ninja figurines on desk setup'
    }
  ];

  // Create placeholder colors for dummy images
  const placeholderColors = [
    'bg-gradient-to-br from-gray-700 to-gray-800',
    'bg-gradient-to-br from-red-900 to-black',
    'bg-gradient-to-br from-red-800 to-red-900',
    'bg-gradient-to-br from-red-700 to-red-800',
    'bg-gradient-to-br from-red-900 to-red-950',
    'bg-gradient-to-br from-black to-red-900',
    'bg-gradient-to-br from-orange-700 to-red-800',
    'bg-gradient-to-br from-gray-800 to-black'
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-3 sm:mb-4 lg:mb-5">
        <h2 className="text-white 
          text-base sm:text-lg md:text-xl lg:text-[20px] 
          font-bold 
          mb-1 sm:mb-2 
          leading-tight font-plus-jakarta">
          Recent Images
        </h2>
        <p className="text-[#9CA3AF] 
          text-xs sm:text-sm md:text-base lg:text-[14px] 
          font-normal 
          leading-relaxed font-plus-jakarta lg:leading-[21px]">
          Manage and track all your created images
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {recentImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square 
              rounded-md overflow-hidden 
              bg-[#151515] border border-[#242424] 
              hover:border-[#DC2626]/50 
              hover:-translate-y-1 
              hover:shadow-[0_20px_40px_rgba(12,11,12,0.45)]
              transition-all duration-300 cursor-pointer
              shadow-[0_0_0_1px_rgba(13,12,13,0.15)]"
          >
            {/* Placeholder background with gradient */}
            <div className={`absolute inset-0 ${placeholderColors[index]} opacity-80`} />
            
            {/* Placeholder content */}
            <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
              <div className="text-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto mb-1 sm:mb-2 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/60 text-xs sm:text-sm lg:text-base font-bold">🥷</span>
                </div>
                <p className="text-white/40 
                  text-[10px] sm:text-xs lg:text-sm 
                  font-medium px-1 
                  line-clamp-2 leading-tight">
                  {image.alt}
                </p>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
                <div className="text-center">
                  <p className="text-white 
                    text-[10px] sm:text-xs 
                    font-medium mb-1 sm:mb-2">
                    View Image
                  </p>
                  <p className="text-white/70 
                    text-[9px] sm:text-[10px] 
                    line-clamp-3 leading-tight">
                    {image.prompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Corner indicator */}
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#DC2626] rounded-full opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentImages;