import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAssistant } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";

interface NinjaAssistantCardProps {
  suggestions?: string[];
}

const NinjaAssistantCard: FC<NinjaAssistantCardProps> = ({
  suggestions = [
    'Help me write a compelling value proposition for my startup',
    'Generate 10 creative marketing ideas for a new product launch',
    'What are the key metrics I should track for my SaaS business?',
    'Write a professional email to potential investors'
  ]
}) => {
  const navigate = useNavigate();

  const handleSuggestionClick = (suggestion: string) => {
    // Navigate to AI Chat with the suggestion as a URL parameter
    navigate(`/ai-tools/chat?prompt=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="group relative h-full w-full">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex h-full w-full flex-col rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#2A2A2A] group-hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3B3B]/20 to-[#B91C1C]/10 sm:h-9 sm:w-9">
            <MdAssistant className="h-5 w-5 text-[#FF3B3B] sm:h-6 sm:w-6" />
          </div>
          <h2 className="font-plus-jakarta text-base font-bold text-white sm:text-lg">
            Ninja Assistant
          </h2>
        </div>

        {/* Divider */}
        <div className="mb-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Suggestions */}
        <div className="flex flex-1 flex-col gap-2.5">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="group/item relative flex items-start gap-3 overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 text-left transition-all duration-200 hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-[0.98] sm:p-3.5"
            >
              {/* Arrow Icon */}
              <div className="flex-shrink-0 pt-0.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FF3B3B]/10">
                  <FiArrowRight className="h-3 w-3 text-[#FF3B3B] transition-transform duration-200 group-hover/item:translate-x-0.5" />
                </div>
              </div>

              {/* Text */}
              <p className="flex-1 font-plus-jakarta text-xs leading-relaxed text-white/90 sm:text-[13px]">
                {suggestion}
              </p>

              {/* Shine effect on hover */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NinjaAssistantCard;
