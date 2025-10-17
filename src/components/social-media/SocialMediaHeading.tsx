import type { FC } from 'react';
import { THEME_COLORS } from '../../constants/platforms';


const SocialMediaHeading: FC = () => {

  return (
    <section
      className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-no-repeat bg-center md:bg-center bg-cover
      border-[#ff3b3b47] min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
      style={{ borderColor: THEME_COLORS.lightred || '#DE05001A', backgroundSize: 'cover' }}
    >
      <div className="absolute inset-0 bg-[#f5212e0d]" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
        <div className="flex-1 min-w-0">
          <h2 className="font-plus-jakarta w-full text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
            Social Media Ninja
          </h2>
          <p className="font-plus-jakarta mt-1 text-xs leading-5 text-gray-300 sm:mt-2 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
            Post and schedule content across Facebook, Instagram, X, and LinkedIn with AI optimization. 
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default SocialMediaHeading;
