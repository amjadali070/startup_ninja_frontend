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
    <div className="ninja-assistant-card w-full max-w-[368px] max-h-[526.67px] rounded-2xl p-6 bg-[#0D0D0D]">
      {/* Header with Logo and Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-600">
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
        <h2 className="text-white text-xl font-semibold">Ninja Assistant</h2>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="ninja-suggestion-item rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/5 bg-white/[0.03]"
          >
            <p className="text-white text-sm leading-relaxed">
              {suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NinjaAssistantCard;
