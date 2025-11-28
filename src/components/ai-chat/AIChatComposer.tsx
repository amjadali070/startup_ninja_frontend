import type { ChangeEvent, FC, KeyboardEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { GiNinjaStar } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";

interface AIChatComposerProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => Promise<boolean> | boolean;
  onNewChat?: () => void;
  placeholder?: string;
  isGenerating?: boolean;
  tokenUsage?: number;
  usageLimit?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const AIChatComposer: FC<AIChatComposerProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  onNewChat,
  placeholder = "Ask me anything...",
  isGenerating = false,
  onKeyDown,
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus input when generation finishes
  useEffect(() => {
    if (!isGenerating && !isSubmitting) {
      // Use a small timeout to ensure state updates have propagated and DOM is ready
      const timeoutId = setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [isGenerating, isSubmitting]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(event.target.value);
  };

  const handleSubmit = async () => {
    if (isGenerating || isSubmitting || !prompt.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDownInternal = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const disabled = isGenerating || isSubmitting;

  return (
    <div
      className={`w-full rounded-2xl border border-[#242424] bg-[#151515] p-2 shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg sm:p-4 md:p-5 ${
        className ?? ""
      }`}
    >
      <div className="flex h-full flex-col">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleChange}
          onKeyDown={handleKeyDownInternal}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          aria-label="Chat prompt"
          className="min-h-[70px] w-full flex-1 resize-none border-none bg-transparent text-base leading-6 text-white/70 placeholder:text-white/25 focus:outline-none sm:min-h-[100px] sm:text-lg"
        />

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-[14px] border border-[#FF0600] px-3 py-1.5 text-xs font-semibold text-[#FF0600] shadow-[0_12px_30px_rgba(222,5,0,0.25)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF0600]/10"
                aria-label="New chat"
              >
                <FaPlus className="h-3.5 w-3.5" />
                New Chat
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1 text-white/45 sm:flex-nowrap sm:gap-2">
            {/* <button
              type="button"
              aria-label="Attach file"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              <FiPaperclip className="h-[14px] w-[14px]" />
            </button>
            <button
              type="button"
              aria-label="Voice input"
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              <PiWaveformBold className="h-[14px] w-[14px]" />
            </button> */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={disabled || !prompt.trim()}
              aria-label="Send message"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#DE0500] text-white shadow-[0_20px_40px_rgba(222,5,0,0.45)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {disabled ? (
                <GiNinjaStar className="h-4 w-4 animate-spin" />
              ) : (
                <IoSend className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatComposer;
