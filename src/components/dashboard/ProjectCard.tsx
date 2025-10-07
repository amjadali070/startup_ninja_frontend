import { useEffect, useRef } from 'react';
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
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${clampedProgress}%`;
    }
  }, [clampedProgress]);

  return (
    <div className="relative w-full">
      <div className="relative flex h-full w-full overflow-hidden rounded-md border-[1.33px] border-[#191919] px-6 py-6 shadow-[0px_5.33px_5.33px_rgba(0,0,0,0.25)] sm:px-8 sm:py-[26px]">
        <div className="pointer-events-none absolute inset-0 rounded-md border-[1.33px] border-transparent" />
        <div className="relative z-10 flex w-full flex-col gap-6 text-white md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex w-full flex-col gap-3 md:max-w-[430px]">
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
              <div
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${clampedProgress}% complete`}
                className="relative h-3 w-full overflow-hidden rounded-full bg-white/10"
              >
                <div
                  ref={progressFillRef}
                  className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] shadow-[0px_4px_16px_rgba(229,0,0,0.35)] transition-[width] duration-300 ease-out"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-between gap-4 md:h-full md:w-auto md:min-w-[180px] md:items-end">
            <span className="font-plus-jakarta text-xs text-white/60">
              Last Update <span className="text-white/80 ">{lastUpdated}</span>
            </span>
            <button
              type="button"
              className="inline-flex h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] font-plus-jakarta text-sm font-semibold text-white shadow-[0px_5.33px_20px_rgba(229,0,0,0.35)] transition-transform duration-200 hover:scale-[1.01] md:w-[186px]"
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
