import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AIToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  ctaLabel: string;
  ctaTo?: string;
  onCta?: () => void;
}

const AIToolCard: FC<AIToolCardProps> = ({
  title,
  description,
  icon,
  ctaLabel,
  ctaTo,
  onCta,
}) => {
  const navigate = useNavigate();

  const isInteractive = Boolean(ctaTo || onCta);

  const handleClick = () => {
    if (!isInteractive) {
      return;
    }

    if (ctaTo) {
      navigate(ctaTo);
      return;
    }

    onCta?.();
  };

  const baseCardClasses =
    'group relative flex h-full w-full flex-col rounded-md border border-[#242424] bg-[#151515] p-2.5 shadow-[0_0_0_1px_rgba(13,12,13,0.15)] transition-all duration-300 sm:p-3 lg:p-4 xl:p-5';
  const interactiveCardClasses =
    'cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[rgba(129,0,0,0.45)] hover:via-[rgba(58,0,0,0.35)] hover:to-[rgba(29,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(12,11,12,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]';
  const staticCardClasses = 'cursor-default';

  return (
    <article className={`${baseCardClasses} ${isInteractive ? interactiveCardClasses : staticCardClasses}`}>
      <div className="flex flex-1 flex-col gap-2 sm:gap-3 lg:gap-3">
        <span className="inline-flex w-max p-0.5 sm:p-1 lg:p-1.5">
          <span className="flex h-5 w-5 items-center justify-center text-base text-[#B91C1C] sm:h-6 sm:w-6 sm:text-lg lg:h-7 lg:w-7 lg:text-[18px]">
            {icon}
          </span>
        </span>

        <h3 className="font-plus-jakarta text-sm font-bold leading-tight text-white sm:text-base md:text-lg lg:text-[16px]">
          {title}
        </h3>

        <p className="flex-1 font-plus-jakarta text-[10px] font-normal leading-relaxed text-[#9CA3AF] sm:text-xs md:text-sm lg:text-[12px] lg:leading-[18px]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={isInteractive ? handleClick : undefined}
        disabled={!isInteractive}
        className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-inter text-[10px] font-medium text-center transition-all duration-200 sm:mt-4 sm:w-auto sm:self-start sm:text-xs lg:px-4 lg:py-2 lg:text-[12px] ${isInteractive ? 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F87171]' : 'cursor-not-allowed bg-white/5 text-white/50'}`}
        aria-disabled={!isInteractive}
      >
        {ctaLabel}
      </button>
    </article>
  );
};

export default AIToolCard;
