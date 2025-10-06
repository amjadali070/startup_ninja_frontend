import { useId } from 'react';
import type { FC } from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  status: 'Draft' | 'Live' | 'Paused';
  progress: number;
  lastUpdated: string;
}

const statusColors: Record<ProjectCardProps['status'], string> = {
  Draft: 'bg-[#FF4D4D] text-[#FFB3B3]',
  Live: 'bg-emerald-500/20 text-emerald-300',
  Paused: 'bg-yellow-500/20 text-yellow-300',
};

const ProjectCard: FC<ProjectCardProps> = ({ title, category, status, progress, lastUpdated }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const gradientId = useId();

  return (
    <div className="rounded-3xl border border-white/5 bg-[linear-gradient(160deg,rgba(28,28,43,0.95)_0%,rgba(23,23,35,0.95)_100%)] p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">{category}</p>
            <h4 className="mt-1 text-lg font-semibold text-white">{title}</h4>
          </div>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusColors[status]}`}>
            ● {status}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/40">
            <span>{clampedProgress}% Complete</span>
            <span>Last update {lastUpdated}</span>
          </div>
          <div className="mt-2">
            <svg viewBox="0 0 100 6" className="h-2 w-full" aria-hidden="true">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF3B3B" />
                  <stop offset="50%" stopColor="#E50000" />
                  <stop offset="100%" stopColor="#A60000" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="100" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
              <rect
                x="0"
                y="0"
                width={clampedProgress}
                height="6"
                rx="3"
                fill={`url(#${gradientId})`}
              />
            </svg>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white"
      >
        Continue Building
      </button>
    </div>
  );
};

export default ProjectCard;
