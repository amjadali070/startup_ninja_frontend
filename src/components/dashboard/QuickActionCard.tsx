import type { FC, ReactNode } from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  icon: ReactNode;
}

const QuickActionCard: FC<QuickActionCardProps> = ({ title, description, buttonLabel, icon }) => {
  return (
    <div className="relative flex h-full flex-col rounded-[8px] bg-[#151515] p-8 xl:p-12 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-6 flex">
        <span className="inline-flex p-[2.67px]">
          <span className="flex h-10 w-10 items-center justify-center text-[#B91C1C]">
            {icon}
          </span>
        </span>
      </div>
      <h3 className="text-lg font-semibold text-[#FFFFFF]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#9CA3AF]">{description}</p>
      <button
        type="button"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-[#FFFFFF0D] px-6 text-sm font-semibold text-[#FFFFFF] transition-colors duration-200 hover:bg-[#FFFFFF1A]"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default QuickActionCard;

