import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

export interface AIToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  features?: string[];
  ctaLabel: string;
  ctaTo?: string;
  onCta?: () => void;
  badge?: string;
  footer?: ReactNode;
  gradient?: string;
  popular?: boolean;
}

const AIToolCard: FC<AIToolCardProps> = ({
  title,
  description,
  icon,
  features = [],
  ctaLabel,
  ctaTo,
  onCta,
  badge,
  footer,
  gradient,
  popular = false,
}) => {
  const navigate = useNavigate();

  const isInteractive = Boolean(ctaTo || onCta);

  const handlePrimaryAction = () => {
    if (!isInteractive) {
      return;
    }

    if (ctaTo) {
      navigate(ctaTo);
      return;
    }

    onCta?.();
  };

  const cardClasses = `relative flex h-full w-full flex-col overflow-hidden rounded-[16px] sm:rounded-[18px] lg:rounded-[20px] border transition-all duration-500 transform ${
    isInteractive 
      ? 'hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] focus-within:scale-[1.01] sm:focus-within:scale-[1.02]' 
      : ''
  } ${
    popular 
      ? 'border-[#FF3B3B]/40 bg-gradient-to-br from-[#FF3B3B]/8 via-[#0E0E16] to-[#0E0E16] shadow-[0_20px_40px_rgba(255,59,59,0.2)] sm:shadow-[0_24px_50px_rgba(255,59,59,0.25)]'
      : 'border-white/10 bg-[#0E0E16] shadow-[0_16px_36px_rgba(0,0,0,0.3)] sm:shadow-[0_22px_45px_rgba(0,0,0,0.35)]'
  } ${
    isInteractive && popular
      ? 'hover:border-[#FF3B3B]/60 hover:shadow-[0_24px_60px_rgba(255,59,59,0.3)] sm:hover:shadow-[0_32px_70px_rgba(255,59,59,0.35)]'
      : isInteractive
      ? 'hover:border-[#FF3B3B]/50 hover:shadow-[0_20px_50px_rgba(255,59,59,0.18)] sm:hover:shadow-[0_32px_70px_rgba(255,59,59,0.22)]'
      : ''
  }`;

  return (
    <article className={cardClasses}>
      {/* Enhanced gradient overlay */}
      <div className={`pointer-events-none absolute inset-0 ${gradient || 'bg-gradient-to-br from-white/[0.03] via-transparent to-transparent'}`} aria-hidden />
      
      {/* Glow effect for popular cards */}
      {popular && (
        <div className="pointer-events-none absolute -inset-[1px] rounded-[20px] bg-gradient-to-r from-[#FF3B3B]/20 via-[#FF3B3B]/10 to-transparent opacity-40" aria-hidden />
      )}

      <div className="relative z-10 flex flex-col gap-4 sm:gap-6 p-5 sm:p-6 lg:p-8 h-full">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-[14px] sm:rounded-[16px] bg-gradient-to-br from-white/10 to-white/5 text-xl sm:text-2xl text-[#FF5D5D] shadow-[0_10px_24px_rgba(255,93,93,0.2)] sm:shadow-[0_12px_28px_rgba(255,93,93,0.2)] backdrop-blur-sm">
            {icon}
          </div>
          {badge ? (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-white/80 backdrop-blur-sm">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="space-y-3 sm:space-y-4 flex-1">
          <h3 className="text-lg sm:text-xl lg:text-[22px] xl:text-[24px] font-bold leading-tight text-white">{title}</h3>
          <p className="text-sm sm:text-base leading-relaxed text-white/70">{description}</p>
        </div>

        {features.length > 0 && (
          <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-white/75">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 sm:gap-3">
                <span className="mt-[2px] inline-flex h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#FF3B3B]/25 text-[#FF9191]">
                  <FiCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 sm:pt-4">
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={!isInteractive}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold transition-all duration-300 w-full ${
              isInteractive
                ? 'bg-gradient-to-r from-[#FF3B3B] via-[#E50000] to-[#A60000] text-white shadow-[0_12px_28px_rgba(229,0,0,0.3)] sm:shadow-[0_15px_32px_rgba(229,0,0,0.35)] hover:scale-[1.02] sm:hover:scale-[1.05] hover:shadow-[0_16px_36px_rgba(229,0,0,0.4)] sm:hover:shadow-[0_20px_40px_rgba(229,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3B3B]'
                : 'cursor-not-allowed bg-white/5 text-white/40'
            }`}
            aria-disabled={!isInteractive}
          >
            <span>{ctaLabel}</span>
            {isInteractive && <FiArrowRight className="h-4 w-4" />}
          </button>

          {footer && <div className="mt-3 sm:mt-4">{footer}</div>}
        </div>
      </div>
    </article>
  );
};

export default AIToolCard;
