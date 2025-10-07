import type { FC } from 'react';

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
  <div className="ninja-assistant-card flex h-full w-full flex-col rounded-2xl bg-[#0D0D0D] p-5 shadow-[0px_5px_20px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 sm:h-14 sm:w-14">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="ninja-star-icon"
          >
            <path 
              d="M12 2L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z" 
              fill="white"
            />
            <path 
              d="M12 2L12 8L16 12L12 16L12 22L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z" 
              fill="white"
              fillOpacity="0.8"
            />
            <circle cx="12" cy="12" r="2" fill="#DC2626"/>
          </svg>
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
