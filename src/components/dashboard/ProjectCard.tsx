import type { FC } from 'react';
import { FiArrowRight, FiClock } from 'react-icons/fi';

interface ProjectCardProps {
  websiteId: string;
  title: string;
  category?: string;
  status: 'Draft' | 'Live' | 'Paused';
  lastUpdated: string;
}

const statusStyles: Record<ProjectCardProps['status'], { badge: string; dot: string; text: string; glow: string }> = {
  Draft: {
    badge: 'bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.3)]',
    dot: 'bg-[#EF4444]',
    text: 'text-[#FF6C6C]',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  },
  Live: {
    badge: 'bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.3)]',
    dot: 'bg-[#10B981]',
    text: 'text-[#34D399]',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
  },
  Paused: {
    badge: 'bg-[rgba(234,179,8,0.12)] border-[rgba(234,179,8,0.3)]',
    dot: 'bg-[#F59E0B]',
    text: 'text-[#FBBF24]',
    glow: 'shadow-[0_0_12px_rgba(234,179,8,0.15)]',
  },
};

const ProjectCard: FC<ProjectCardProps> = ({ websiteId, title, category = 'Website Builder', status, lastUpdated }) => {
  const statusTheme = statusStyles[status];

  const handleContinue = () => {
    // Open website editor in new tab, same as Edit Website button in WebBuilder
    window.open(`/ai-tools/web-builder/new-website?id=${websiteId}`, '_blank');
  };

  return (
    <div className="group relative w-full">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-3.5 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#2A2A2A] group-hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-4">
        {/* Header Section */}
        <div className="flex w-full items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-plus-jakarta text-sm font-bold leading-tight text-white mb-1 sm:text-base truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              <span className="font-medium">{category}</span>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${statusTheme.badge} ${statusTheme.glow} backdrop-blur-sm flex-shrink-0`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusTheme.dot} animate-pulse`} />
            <span className={`text-[9px] font-semibold uppercase tracking-wider ${statusTheme.text}`}>
              {status}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

        {/* Footer Section */}
        <div className="flex w-full items-center justify-between gap-3 mt-auto">
          {/* Last Update */}
          <div className="flex items-center gap-1.5 text-white/60">
            <FiClock className="h-3 w-3" />
            <span className="font-plus-jakarta text-[11px]">
              {lastUpdated}
            </span>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            className="group/btn relative inline-flex h-7 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#B91C1C] px-4 font-plus-jakarta text-[11px] font-semibold text-white shadow-[0px_4px_16px_rgba(229,0,0,0.3)] transition-all duration-300 hover:shadow-[0px_6px_20px_rgba(229,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] sm:h-8 sm:px-5"
          >
            <span className="relative z-10">Continue</span>
            <FiArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
