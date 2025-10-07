import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const baseCardClasses =
    'group relative flex h-full w-full flex-col rounded-md border border-[#242424] bg-[#151515] p-4 shadow-[0_0_0_1px_rgba(13,12,13,0.15)] transition-all duration-300 sm:p-6 lg:p-8 xl:p-10';
  const interactiveCardClasses =
    'cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[rgba(129,0,0,0.45)] hover:via-[rgba(58,0,0,0.35)] hover:to-[rgba(29,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(12,11,12,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DC2626]';
  const staticCardClasses = 'cursor-default';

  return (
    <article className={`${baseCardClasses} ${isInteractive ? interactiveCardClasses : staticCardClasses}`}>
      <div className="flex flex-1 flex-col gap-4 sm:gap-5 lg:gap-6">
        <span className="inline-flex w-max p-2 sm:p-2.5 lg:p-3">
          <span className="flex h-8 w-8 items-center justify-center text-xl text-[#B91C1C] sm:h-12 sm:w-12 sm:text-2xl lg:h-10 lg:w-10 lg:text-[30px]">
            {icon}
          </span>
        </span>

        <h3 className="font-plus-jakarta text-lg font-bold leading-tight text-white sm:text-xl md:text-2xl lg:text-[26px]">
          {title}
        </h3>

        <p className="flex-1 font-plus-jakarta text-sm font-normal leading-relaxed text-[#9CA3AF] sm:text-base md:text-lg lg:text-[18px] lg:leading-[27px]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={isInteractive ? handleClick : undefined}
        disabled={!isInteractive}
        className={`mt-6 inline-flex w-full items-center justify-center gap-3 rounded-lg px-5 py-3 font-inter text-sm font-medium text-center transition-all duration-200 sm:mt-8 sm:w-auto sm:self-start sm:text-base lg:px-6 lg:py-[14px] lg:text-[18px] ${isInteractive ? 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F87171]' : 'cursor-not-allowed bg-white/5 text-white/50'}`}
        aria-disabled={!isInteractive}
      >
        {buttonLabel}
      </button>
    </article>
  );
};

export default QuickActionCard;

