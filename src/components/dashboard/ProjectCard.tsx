import { useId } from 'react';
import type { FC } from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  status: 'Draft' | 'Live' | 'Paused';
  progress: number;
  lastUpdated: string;
}

const statusStyles: Record<ProjectCardProps['status'], { badge: string; dot: string; text: string }> = {
  Draft: {
    badge: 'bg-[rgba(239,68,68,0.16)]',
    dot: 'text-[#EF4444]',
    text: 'text-[#FF6C6C]',
  },
  Live: {
    badge: 'bg-[rgba(16,185,129,0.16)]',
    dot: 'text-[#34D399]',
    text: 'text-[#7FF2C8]',
  },
  Paused: {
    badge: 'bg-[rgba(234,179,8,0.16)]',
    dot: 'text-[#F59E0B]',
    text: 'text-[#F6DA7E]',
  },
};

const ProjectCard: FC<ProjectCardProps> = ({ title, category, status, progress, lastUpdated }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const statusTheme = statusStyles[status];
  const gradientId = useId();

  return (
  <div className="relative w-full max-w-[686.67px]">
      <div className="relative flex h-[196px] w-full items-center overflow-hidden rounded-[8px] border-[1.33px] border-[#191919] px-8 py-[26px] shadow-[0px_5.33px_5.33px_rgba(0,0,0,0.25)]">
        <div className="pointer-events-none absolute inset-0 rounded-[8px] border-[1.33px] border-transparent [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude]" />
        <div className="relative z-10 flex w-full items-center justify-between gap-10 text-white">
          <div className="flex w-full max-w-[430px] flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-plus-jakarta text-[18px] font-semibold leading-[28px] tracking-[-0.01em]">{title}</h3>
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold leading-none ${statusTheme.badge} ${statusTheme.text}`}>
                <span className={`text-[9px] leading-none ${statusTheme.dot}`}>●</span>
                {status}
              </span>
            </div>
            <p className="font-plus-jakarta text-sm text-white/60">{category}</p>
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-plus-jakarta text-xs uppercase tracking-[0.24em] text-white/50">{clampedProgress}% Complete</span>
              <div className="relative h-[10.67px] w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
                <svg viewBox="0 0 100 10.67" className="h-full w-full" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF3B3B" />
                      <stop offset="52%" stopColor="#E50000" />
                      <stop offset="100%" stopColor="#A60000" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="100" height="10.67" rx="5.335" fill="rgba(255,255,255,0.08)" />
                  <rect x="0" y="0" width={clampedProgress} height="10.67" rx="5.335" fill={`url(#${gradientId})`} />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex h-full min-w-[180px] flex-col items-end justify-between">
            <span className="font-plus-jakarta text-xs text-white/60">
              Last Update <span className="text-white/80 ">{lastUpdated}</span>
            </span>
            <button
              type="button"
              className=" mt-3 inline-flex h-[48px] w-[186px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] font-plus-jakarta text-sm font-semibold text-white shadow-[0px_5.33px_20px_rgba(229,0,0,0.35)] transition-transform duration-200 hover:scale-[1.01]"
            >
              Continue Building
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
