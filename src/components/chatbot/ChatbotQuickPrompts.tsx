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
  <div className="space-y-4 overflow-x-hidden px-4 pb-3 sm:px-6">
    <div className="px-1 sm:px-2">
      <h2 className="text-[22px] font-semibold leading-[30px] text-white sm:text-[24px] sm:leading-[34px]">
        How can I help you?
      </h2>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="rounded-full bg-[#1C1D21] px-4 py-3 text-[11px] font-medium text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  </div>
);

export default ChatbotQuickPrompts;

