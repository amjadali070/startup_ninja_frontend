import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface QuickActionCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
  to?: string;
}

const QuickActionCard: FC<QuickActionCardProps> = ({ title, description, buttonLabel, icon, to }) => {
  const navigate = useNavigate();
  const isInteractive = Boolean(to);

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <article
      onClick={isInteractive ? handleClick : undefined}
      className={`group/card relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-3 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 sm:p-4 ${
        isInteractive
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#2A2A2A] hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)]'
          : 'cursor-default'
      }`}
    >
      {/* Gradient border glow on hover */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover/card:opacity-100" />

      {/* Icon + Title row */}
      <div className="relative z-10 flex items-center gap-2.5 mb-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3B3B]/20 to-[#B91C1C]/10">
          <span className="flex h-5 w-5 items-center justify-center text-[#FF3B3B]">
            {icon}
          </span>
        </div>
        <h3 className="font-plus-jakarta text-sm font-bold leading-tight text-white">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="relative z-10 flex-1 font-plus-jakarta text-[11px] leading-relaxed text-white/50 mb-3">
        {description}
      </p>

      {/* CTA Button */}
      <button
        type="button"
        onClick={isInteractive ? (e) => { e.stopPropagation(); handleClick(); } : undefined}
        disabled={!isInteractive}
        className={`relative z-10 mt-auto inline-flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-1.5 font-plus-jakarta text-[11px] font-semibold transition-all duration-200 ${
          isInteractive
            ? 'bg-white/[0.06] text-white/80 hover:bg-gradient-to-r hover:from-[#FF3B3B] hover:to-[#B91C1C] hover:text-white hover:shadow-[0_4px_12px_rgba(255,59,59,0.3)]'
            : 'cursor-not-allowed bg-white/[0.03] text-white/30'
        }`}
        aria-disabled={!isInteractive}
      >
        {buttonLabel}
        {isInteractive && <FiArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/card:translate-x-0.5" />}
      </button>

      {/* Shine sweep effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover/card:translate-x-full" />
    </article>
  );
};

export default QuickActionCard;
