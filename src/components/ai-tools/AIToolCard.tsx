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
    'group relative flex h-full w-full flex-col rounded-md border border-[#242424] bg-[#151515] p-3 shadow-[0_0_0_1px_rgba(13,12,13,0.15)] transition-all duration-300 sm:p-4 lg:p-5 xl:p-6';
  const interactiveCardClasses =
    'cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[rgba(129,0,0,0.45)] hover:via-[rgba(58,0,0,0.35)] hover:to-[rgba(29,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(12,11,12,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]';
  const staticCardClasses = 'cursor-default';

  return (
    <article className={`${baseCardClasses} ${isInteractive ? interactiveCardClasses : staticCardClasses}`}>
      <div className="flex flex-1 flex-col gap-3 sm:gap-4 lg:gap-4">
        <span className="inline-flex w-max p-1 sm:p-1.5 lg:p-2">
          <span className="flex h-6 w-6 items-center justify-center text-lg text-[#B91C1C] sm:h-8 sm:w-8 sm:text-xl lg:h-9 lg:w-9 lg:text-[22px]">
            {icon}
          </span>
        </span>

        <h3 className="font-plus-jakarta text-base font-bold leading-tight text-white sm:text-lg md:text-xl lg:text-[20px]">
          {title}
        </h3>

        <p className="flex-1 font-plus-jakarta text-xs font-normal leading-relaxed text-[#9CA3AF] sm:text-sm md:text-base lg:text-[14px] lg:leading-[21px]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={isInteractive ? handleClick : undefined}
        disabled={!isInteractive}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-inter text-xs font-medium text-center transition-all duration-200 sm:mt-5 sm:w-auto sm:self-start sm:text-sm lg:px-5 lg:py-2.5 lg:text-[14px] ${isInteractive ? 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F87171]' : 'cursor-not-allowed bg-white/5 text-white/50'}`}
        aria-disabled={!isInteractive}
      >
        {ctaLabel}
      </button>
    </article>
  );
};

export default AIToolCard;
