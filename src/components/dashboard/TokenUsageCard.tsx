import { useId } from 'react';
import type { FC } from 'react';

interface TokenUsageCardProps {
  used: number;
  limit: number;
  resetInHours: number;
}

const TokenUsageCard: FC<TokenUsageCardProps> = ({ used, limit, resetInHours }) => {
  const safeLimit = Math.max(limit, 0);
  const usagePercent = safeLimit > 0 ? Math.min((used / safeLimit) * 100, 100) : 0;
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (usagePercent / 100) * circumference;
  const gradientId = useId();

  return (
  <div className="flex h-full w-full flex-col rounded-[12px] border-[1.33px] border-[#191919] px-6 pb-8 pt-7 text-center shadow-[0px_10px_35px_rgba(0,0,0,0.35)] sm:px-8 sm:pb-10 sm:pt-9">
      <h3 className="font-plus-jakarta text-xl font-semibold leading-[28px] text-white sm:text-[24px] sm:leading-[30px]">Tokens Usage</h3>

      <div className="mt-8 flex justify-center sm:mt-10">
        <div className="relative w-full max-w-[210px] sm:max-w-[236px] lg:max-w-[260px]">
          <div className="relative aspect-square">
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 240 240"
              aria-hidden="true"
            >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF3B3B" />
                <stop offset="48%" stopColor="#E00000" />
                <stop offset="100%" stopColor="#A00000" />
              </linearGradient>
            </defs>
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#1F2026"
              strokeWidth="20"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth="20"
              strokeLinecap="square"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

            <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-md">
              <span className="font-plus-jakarta text-[32px] font-semibold leading-[36px] text-white sm:text-[40px] sm:leading-[44px]">
                {used.toLocaleString()}
              </span>
              <span className="mt-1 font-plus-jakarta text-sm text-[#A7ADB7] sm:text-base">Tokens Used</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-8 space-y-5 text-left sm:mt-10"
        aria-label={`You have used ${used.toLocaleString()} tokens out of ${safeLimit.toLocaleString()} tokens. ${resetInHours} hours until reset.`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-plus-jakarta text-sm text-[#9CA3AF] sm:text-lg">Daily Limit</span>
          <span className="font-plus-jakarta text-sm font-semibold text-white sm:text-lg">
            {safeLimit.toLocaleString()} Tokens
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-plus-jakarta text-sm text-[#9CA3AF] sm:text-lg">Reset In</span>
          <span className="font-plus-jakarta text-sm font-semibold text-white sm:text-lg">{resetInHours} Hours</span>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageCard;
