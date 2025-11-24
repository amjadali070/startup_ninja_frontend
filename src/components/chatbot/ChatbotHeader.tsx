import { forwardRef } from "react";
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
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[#121214] px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6 pb-2 sm:pb-3 md:pb-4"
    >
      <button
        type="button"
        onClick={onToggleHistory}
        className="inline-flex min-h-[36px] sm:min-h-[32px] w-auto items-center justify-center gap-0.5 rounded-md bg-[linear-gradient(180deg,_#FF5C5C_0%,_#DC0000_100%)] px-2 sm:px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
      >
        <MdKeyboardArrowLeft
          className={`text-base sm:text-lg transition-transform duration-200 ${
            historyOpen ? "rotate-180" : ""
          }`}
        />
        <span className="hidden xs:inline">Chats</span>
      </button>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={onStartNewChat}
          className="flex items-center gap-1 sm:gap-2 text-white/85 transition-colors duration-200 hover:text-white"
        >
          <FiPlus className="text-base sm:text-lg" />
          <span className="hidden sm:inline">New chat</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/7 text-white/75 transition-all duration-200 hover:bg-white/12 hover:text-white"
        >
          <FiX className="text-base sm:text-lg" />
          <span className="sr-only">Close chatbot</span>
        </button>
      </div>
    </header>
  )
);

ChatbotHeader.displayName = "ChatbotHeader";

export default ChatbotHeader;
