import { cloneElement, isValidElement } from 'react';
import type { FC, ReactNode } from 'react';

interface AIChatQuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

const AIChatQuickActionCard: FC<AIChatQuickActionCardProps> = ({ title, description, icon, onClick }) => {
  const Component = onClick ? 'button' : 'div';
  const renderedIcon = isValidElement(icon)
    ? cloneElement(icon, {
        className: `${icon.props.className ?? ''} h-[18px] w-[18px] text-white`,
      })
    : icon;

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className="group relative flex h-full min-h-[170px] w-full flex-col justify-between rounded-[8px] border-[1.33px] border-white/10 bg-[#08080B] px-6 py-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3838] hover:shadow-[0_20px_60px_rgba(8,8,12,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3838]/80"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#2B0B0B] bg-[#1A0808] text-white shadow-[0_16px_40px_rgba(255,56,56,0.25)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#FF2E2E] text-white/95">
          {renderedIcon}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <h3 className="font-plus-jakarta text-[22px] font-semibold leading-snug text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </Component>
  );
};

export default AIChatQuickActionCard;
