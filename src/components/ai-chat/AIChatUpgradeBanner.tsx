import type { FC } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const AIChatUpgradeBanner: FC = () => {
  return (
    <div className="mt-6 flex justify-center px-4">
      <button
        type="button"
        className="inline-flex w-full max-w-[320px] items-center justify-center gap-2 sm:gap-2 rounded-[8px] border-[1.33px] border-[#1E1E1E] bg-[#1A1A1A]/50 px-3 py-2.5 sm:px-4 sm:py-3 text-xs font-medium text-white/80 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-[6px] transition-transform duration-200 hover:scale-[1.01]"
      >
        <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#DE0500] text-white sm:h-[26px] sm:w-[26px]">
          <FiArrowUpRight className="h-3 w-3 sm:h-[14px] sm:w-[14px]" />
        </span>
        <span className="flex flex-1 flex-wrap items-center justify-center gap-1 text-center text-[10px] leading-4 text-white/80 sm:text-[12px] sm:leading-[18px]">
          <span className="font-semibold text-[#DE0500] underline decoration-[#DE0500] decoration-2 underline-offset-4">
            Upgrade
          </span>
          <span className="text-white/80">to free plan for full access</span>
        </span>
      </button>
    </div>
  );
};

export default AIChatUpgradeBanner;
