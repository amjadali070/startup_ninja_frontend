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

  return (
    <div className="relative flex h-full flex-col w-full max-w-[368px] max-h-[342.67px] min-h-[280px] sm:min-h-[320px] lg:min-h-[342.67px] rounded-[8px] bg-[#151515] border-[1.6px] border-[#242424] p-4 sm:p-6 md:p-8 xl:p-12 transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[rgba(129,0,0,0.5)] hover:via-[rgba(58,0,0,0.5)] hover:to-[rgba(29,0,0,0.25)] hover:shadow-[0_0_0_1px_rgba(13,12,13,0.5)] opacity-100">
   
      <div className="mb-4 sm:mb-6 lg:mb-7 flex flex-shrink-0">
        <span className="inline-flex p-[2px] sm:p-[2.67px]">
          <span className="flex w-8 h-8 sm:w-10 sm:h-10 lg:w-[42.67px] lg:h-[42.67px] items-center justify-center text-[#F87171] rounded-md text-xl sm:text-2xl lg:text-3xl">
            {icon}
          </span>
        </span>
      </div>
      
      <h3 className="font-plus-jakarta font-bold text-lg sm:text-xl md:text-2xl lg:text-[26.67px] leading-tight lg:leading-[100%] text-[#FFFFFF] mb-2 sm:mb-3 lg:mb-0">
        {title}
      </h3>
      
      <p className="mt-3 sm:mt-4 lg:mt-6 font-plus-jakarta font-normal text-sm sm:text-base md:text-lg lg:text-[18.33px] leading-relaxed lg:leading-[26.67px] text-[#9CA3AF] flex-grow">
        {description}
      </p>

      <button
        type="button"
        onClick={isInteractive ? handleClick : undefined}
        disabled={!isInteractive}
        className={`mt-6 sm:mt-8 inline-flex w-full sm:w-auto sm:min-w-[180px] lg:w-[200.33px] h-12 sm:h-[53.33px] items-center justify-center rounded-[8px] px-4 sm:px-6 lg:px-[20.67px] py-3 sm:py-[10.67px] gap-2 sm:gap-4 font-inter font-medium text-sm sm:text-base lg:text-[18.13px] leading-6 sm:leading-8 lg:leading-[32px] text-center flex-shrink-0 transition-all duration-200 ${isInteractive ? 'bg-[#FFFFFF0D] text-[#FFFFFF] hover:bg-gradient-to-r hover:from-[#DC2626] hover:to-[#B91C1C]' : 'cursor-not-allowed bg-[#FFFFFF03] text-white/50'}`}
        aria-disabled={!isInteractive}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default QuickActionCard;

