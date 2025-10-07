import type { FC, ReactNode } from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface AIChatQuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const AIChatQuickActionCard: FC<AIChatQuickActionCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-white/5 bg-[#0A0A11] p-6 transition-all duration-300 hover:border-[#FF4D4D]/60 hover:shadow-[0_24px_80px_rgba(12,12,18,0.55)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4D4D]/15 text-[#FF4D4D] shadow-[0_10px_30px_rgba(255,77,77,0.25)]">
        {icon}
      </div>
      <h3 className="mt-6 font-plus-jakarta text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
      <div className="mt-auto pt-6">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#FF4D4D] transition-transform duration-300 group-hover:translate-x-1">
          Explore
          <FiArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default AIChatQuickActionCard;
