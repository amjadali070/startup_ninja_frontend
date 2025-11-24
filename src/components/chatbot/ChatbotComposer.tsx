import React, { forwardRef } from "react";
import { IoSend } from "react-icons/io5";

interface ChatbotComposerProps {
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

const ChatbotComposer = forwardRef<HTMLElement, ChatbotComposerProps>(
  ({ inputValue, onInputChange, onInputKeyDown, onSubmit, isGenerating }, ref) => (
    <footer
      ref={ref}
      className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#121214] px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4"
    >
      <div className="flex w-full items-center gap-2 sm:gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          placeholder="Ask anything..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/45 focus:outline-none"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isGenerating || !inputValue.trim()}
          className="flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 items-center justify-center text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IoSend className="text-lg sm:text-xl" />
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </footer>
  )
);

ChatbotComposer.displayName = "ChatbotComposer";

export default ChatbotComposer;

