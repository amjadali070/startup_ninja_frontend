import type { FC } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const AIChatUpgradeBanner: FC = () => {
  return (
    <div className="mt-10 flex justify-center px-4">
      <button
        type="button"
        className="inline-flex w-full max-w-[385px] items-center justify-center gap-2 sm:gap-[11px] rounded-[8px] border-[1.33px] border-[#1E1E1E] bg-[#1A1A1A]/50 px-4 py-3.5 sm:px-6 sm:py-4 text-sm font-medium text-white/80 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-[6px] transition-transform duration-200 hover:scale-[1.01]"
      >
        <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#DE0500] text-white sm:h-[30px] sm:w-[30px]">
          <FiArrowUpRight className="h-4 w-4 sm:h-[16px] sm:w-[16px]" />
        </span>
        <span className="flex flex-1 flex-wrap items-center justify-center gap-1 text-center text-xs leading-5 text-white/80 sm:text-[15px] sm:leading-[22px]">
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
