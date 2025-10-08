import type { FC } from 'react';
import { MdAssistant } from "react-icons/md";

interface NinjaAssistantCardProps {
  suggestions?: string[];
}

const NinjaAssistantCard: FC<NinjaAssistantCardProps> = ({
  suggestions = [
    'Want to create a pitch deck based on your last doc?',
    'Try AI Image Generator to design your brand\'s logo.',
    'Schedule your next social campaign with AI.',
    'Generate hero section visuals for your landing page.'
  ]
}) => {
  return (
  <div className="ninja-assistant-card flex h-full w-full flex-col rounded-md bg-[#0D0D0D] p-3 shadow-[0px_5px_20px_rgba(0,0,0,0.35)] sm:p-4">
      <div className="mb-4 flex items-center gap-2 sm:mb-6">
        <div className="flex items-center justify-center">
          <MdAssistant className="w-6 h-6 sm:w-8 sm:h-8 lg:w-[32px] lg:h-[32px] text-[#B91C1C]" />
        </div>
        <h2 className="font-plus-jakarta text-base font-semibold text-white sm:text-lg lg:text-[18px]">Ninja Assistant</h2>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:gap-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            tabIndex={0}
            className="ninja-suggestion-item cursor-pointer rounded-2xl bg-white/[0.04] p-3 transition-all duration-200 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:p-4"
          >
            <p className="text-xs leading-relaxed text-white sm:text-[13px]">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NinjaAssistantCard;
