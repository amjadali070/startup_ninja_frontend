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
  <div className="flex h-full w-full flex-col rounded-[12px] border-[1.33px] border-[#191919] px-4 pb-6 pt-5 text-center shadow-[0px_10px_35px_rgba(0,0,0,0.35)] sm:px-6 sm:pb-8 sm:pt-7">
      <h3 className="font-plus-jakarta text-lg font-semibold leading-[24px] text-white sm:text-[20px] sm:leading-[26px]">AI Tokens Usage</h3>

      <div className="mt-6 flex justify-center sm:mt-8">
        <div className="relative w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[220px]">
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
              <span className="font-plus-jakarta text-[24px] font-semibold leading-[28px] text-white sm:text-[30px] sm:leading-[34px]">
                {used.toLocaleString()}
              </span>
              <span className="mt-1 font-plus-jakarta text-xs text-[#A7ADB7] sm:text-sm">Tokens Used</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-6 space-y-3 text-left sm:mt-8"
        aria-label={`You have used ${used.toLocaleString()} tokens out of ${safeLimit.toLocaleString()} tokens. ${resetInHours} hours until reset.`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-plus-jakarta text-xs text-[#9CA3AF] sm:text-sm">Daily Limit</span>
          <span className="font-plus-jakarta text-xs font-semibold text-white sm:text-sm">
            {safeLimit.toLocaleString()} Tokens
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-plus-jakarta text-xs text-[#9CA3AF] sm:text-sm">Reset In</span>
          <span className="font-plus-jakarta text-xs font-semibold text-white sm:text-sm">{resetInHours} Hours</span>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageCard;
