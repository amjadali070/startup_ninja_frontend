import React, { forwardRef } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";

interface ChatbotHeaderProps {
  onToggleHistory: () => void;
  onStartNewChat: () => void;
  onClose: () => void;
  historyOpen: boolean;
}

const ChatbotHeader = forwardRef<HTMLElement, ChatbotHeaderProps>(
  ({ onToggleHistory, onStartNewChat, onClose, historyOpen }, ref) => (
    <header
      ref={ref}
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[#121214] px-6 pt-6 pb-4"
    >
      <button
        type="button"
        onClick={onToggleHistory}
        className="inline-flex min-h-[32px] w-auto items-center justify-center gap-0.5 rounded-md bg-[linear-gradient(180deg,_#FF5C5C_0%,_#DC0000_100%)] px-2.5 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
      >
        <MdKeyboardArrowLeft
          className={`text-lg transition-transform duration-200 ${
            historyOpen ? "rotate-180" : ""
          }`}
        />
        Chats
      </button>
      <div className="flex items-center gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={onStartNewChat}
          className="flex items-center gap-2 text-white/85 transition-colors duration-200 hover:text-white"
        >
          <FiPlus className="text-lg" />
          New chat
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/7 text-white/75 transition-all duration-200 hover:bg-white/12 hover:text-white"
        >
          <FiX className="text-lg" />
          <span className="sr-only">Close chatbot</span>
        </button>
      </div>
    </header>
  )
);

ChatbotHeader.displayName = "ChatbotHeader";

export default ChatbotHeader;

