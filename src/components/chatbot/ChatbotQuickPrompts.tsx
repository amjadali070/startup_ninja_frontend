import React from "react";

interface ChatbotQuickPromptsProps {
  prompts: string[];
  disabled?: boolean;
  onSelect: (prompt: string) => void;
}

const ChatbotQuickPrompts: React.FC<ChatbotQuickPromptsProps> = ({
  prompts,
  disabled = false,
  onSelect,
}) => (
  <div className="space-y-3 sm:space-y-4 overflow-x-hidden px-3 sm:px-4 md:px-6 pb-3">
    <div className="px-1 sm:px-2">
      <h2 className="text-xl sm:text-[20px] md:text-[18px] font-semibold leading-tight sm:leading-[30px] md:leading-[34px] text-white">
        How can I help you?
      </h2>
    </div>
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="rounded-full bg-[#1C1D21] px-2.5 py-2 sm:px-3 sm:py-3 text-xs sm:text-xs text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
);

export default ChatbotQuickPrompts;
