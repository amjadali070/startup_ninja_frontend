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
  <div className="ninja-assistant-card flex h-full w-full flex-col rounded-md bg-[#0D0D0D] p-5 shadow-[0px_5px_20px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <div className="flex items-center justify-center">
          <MdAssistant className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[42.67px] lg:h-[42.67px] text-red-600" />
        </div>
        <h2 className="font-plus-jakarta text-lg font-semibold text-white sm:text-xl lg:text-[22px]">Ninja Assistant</h2>
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:gap-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            tabIndex={0}
            className="ninja-suggestion-item cursor-pointer rounded-2xl bg-white/[0.04] p-4 transition-all duration-200 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:p-5"
          >
            <p className="text-sm leading-relaxed text-white sm:text-[15px]">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NinjaAssistantCard;
