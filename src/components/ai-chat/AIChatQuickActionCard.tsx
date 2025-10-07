import type { FC, ReactNode } from 'react';

interface AIChatQuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

const AIChatQuickActionCard: FC<AIChatQuickActionCardProps> = ({ title, description, icon, onClick }) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="group flex h-full flex-col rounded-2xl border border-white/5 bg-[#0A0A11] p-6 text-left transition-all duration-300 hover:border-[#FF4D4D]/60 hover:shadow-[0_24px_80px_rgba(12,12,18,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D4D]/80"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF4D4D]/15 text-[#FF4D4D] shadow-[0_10px_30px_rgba(255,77,77,0.25)]">
        {icon}
      </div>
      <h3 className="mt-6 font-plus-jakarta text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
    </Component>
  );
};

export default AIChatQuickActionCard;
