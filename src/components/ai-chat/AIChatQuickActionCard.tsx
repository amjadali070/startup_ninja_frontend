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
        className: `${icon.props.className ?? ''} h-[22px] w-[22px] text-[#B91C1C]`.trim(),
      })
    : icon;

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
  className="group relative flex h-full min-h-[170px] w-full flex-col justify-between rounded-[8px] border-[1.33px] border-white/10 bg-[#08080B] px-6 py-7 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[linear-gradient(143.82deg,_rgba(129,_0,_0,_0.5)_-18.07%,_rgba(58,_0,_0,_0.5)_4.29%,_rgba(29,_0,_0,_0.25)_56.47%,_rgba(13,_12,_13,_0.5)_101.2%)] hover:shadow-[0_24px_70px_rgba(255,56,56,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3838]/80"
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <span className="flex h-10 w-10 items-center justify-center text-[#B91C1C]">
          {renderedIcon}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-plus-jakarta text-[22px] font-semibold leading-snug text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </Component>
  );
};

export default AIChatQuickActionCard;
