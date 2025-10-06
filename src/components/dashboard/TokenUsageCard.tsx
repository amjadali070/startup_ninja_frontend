import { useId } from 'react';
import type { FC } from 'react';

interface TokenUsageCardProps {
  used: number;
  limit: number;
  resetInHours: number;
}

const TokenUsageCard: FC<TokenUsageCardProps> = ({ used, limit, resetInHours }) => {
  const usagePercent = Math.min((used / limit) * 100, 100);
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (usagePercent / 100) * circumference;
  const gradientId = useId();

  return (
    <div className="rounded-3xl border border-white/5 bg-[linear-gradient(160deg,rgba(28,28,43,0.95)_0%,rgba(23,23,35,0.95)_100%)] p-6 xl:p-7">
      <h3 className="text-lg font-semibold text-white">Tokens Usage</h3>
      <p className="mt-1 text-sm text-white/50">Monitor your AI consumption in real time.</p>

      <div className="mt-8 flex items-center justify-center">
        <div className="relative h-48 w-48 flex items-center justify-center">
          <svg className="h-48 w-48 -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D4D" />
                <stop offset="50%" stopColor="#E50000" />
                <stop offset="100%" stopColor="#A60000" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute flex h-[152px] w-[152px] flex-col items-center justify-center rounded-full border border-white/5 bg-[#09090E] text-center">
            <span className="text-3xl font-semibold text-white">{used.toLocaleString()}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">Token Used</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span className="text-white/50">Daily Limit</span>
          <span className="font-semibold text-white">{limit.toLocaleString()} Token</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50">Reset In</span>
          <span className="font-semibold text-white">{resetInHours} Hours</span>
        </div>
      </div>
    </div>
  );
};

export default TokenUsageCard;
