import { useId } from 'react';
import type { FC } from 'react';

interface TokenUsageCardProps {
  used: number;
  limit: number;
  resetInHours: number;
}

const TokenUsageCard: FC<TokenUsageCardProps> = ({ used, limit, resetInHours }) => {
  const usagePercent = Math.min((used / limit) * 100, 100);
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (usagePercent / 100) * circumference;
  const gradientId = useId();

  return (
  <div className="relative w-full max-w-full rounded-[12px] border-[1.33px] border-[#191919] bg-[#050505] px-8 pb-10 pt-9 text-center">
      <h3 className="font-plus-jakarta text-[24px] font-semibold leading-[30px] text-white">Tokens Usage</h3>

      <div className="mt-10 flex justify-center">
        <div className="relative h-[248px] w-[248px]">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 240 240" aria-hidden="true">
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
              strokeWidth="36"
              fill="none"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth="36"
              strokeLinecap="square"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-[34px] flex flex-col items-center justify-center rounded-full bg-[#050505]">
            <span className="font-plus-jakarta text-[42px] font-semibold leading-[46px] text-white">{used.toLocaleString()}</span>
            <span className="mt-1 font-plus-jakarta text-lg text-[#A7ADB7]">Token Used</span>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6 text-left">
        <div className="flex items-center justify-between">
          <span className="font-plus-jakarta text-lg text-[#9CA3AF]">Daily Limit</span>
          <span className="font-plus-jakarta text-lg font-semibold text-white">{limit.toLocaleString()} Token</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-plus-jakarta text-lg text-[#9CA3AF]">Reset In</span>
          <span className="font-plus-jakarta text-lg font-semibold text-white">{resetInHours} Hours</span>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageCard;
