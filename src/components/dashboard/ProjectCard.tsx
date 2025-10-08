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
      <div className="relative flex h-full w-full overflow-hidden rounded-md border-[1.33px] border-[#191919] px-4 py-4 shadow-[0px_5.33px_5.33px_rgba(0,0,0,0.25)] sm:px-6 sm:py-5">
        <div className="pointer-events-none absolute inset-0 rounded-md border-[1.33px] border-transparent" />
        <div className="relative z-10 flex w-full flex-col gap-4 text-white md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex w-full flex-col gap-2 md:max-w-[380px]">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-plus-jakarta text-[16px] font-semibold leading-[24px] tracking-[-0.01em]">{title}</h3>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold leading-none ${statusTheme.badge} ${statusTheme.text}`}>
                <span className={`text-[8px] leading-none ${statusTheme.dot}`}>●</span>
                {status}
              </span>
            </div>
            <p className="font-plus-jakarta text-xs text-white/60">{category}</p>
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-plus-jakarta text-[10px] uppercase tracking-[0.2em] text-white/50">{clampedProgress}% Complete</span>
              <div
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${clampedProgress}% complete`}
                className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10"
              >
                <div
                  ref={progressFillRef}
                  className="absolute inset-y-0 left-0 w-0 rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] shadow-[0px_4px_16px_rgba(229,0,0,0.35)] transition-[width] duration-300 ease-out"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-between gap-3 md:h-full md:w-auto md:min-w-[160px] md:items-end">
            <span className="font-plus-jakarta text-[10px] text-white/60">
              Last Update <span className="text-white/80 ">{lastUpdated}</span>
            </span>
            <button
              type="button"
              className="inline-flex h-[40px] w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] font-plus-jakarta text-xs font-semibold text-white shadow-[0px_5.33px_20px_rgba(229,0,0,0.35)] transition-transform duration-200 hover:scale-[1.01] md:w-[160px]"
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
