import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import { GiNinjaStar } from 'react-icons/gi';
import { FiGlobe, FiPaperclip, FiImage, FiCpu } from 'react-icons/fi';
import { IoSend } from "react-icons/io5";
import { PiLightbulbFilamentLight } from "react-icons/pi";
import { PiWaveformBold } from "react-icons/pi";


interface AIChatComposerProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => Promise<boolean> | boolean;
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
  placeholder = 'Ask me anything...',
  isGenerating = false,
  onKeyDown,
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const disabled = isGenerating || isSubmitting;

  return (
    <div
      className={`w-full rounded-2xl border border-[#242424] bg-[#151515] p-3 shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg sm:p-4 md:p-5 ${
        className ?? ''
      }`}
    >
      <div className="flex h-full flex-col gap-1">
        <textarea
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
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#FF0600] px-3 py-1.5 text-xs font-semibold text-[#FF0600] shadow-[0_12px_30px_rgba(222,5,0,0.25)] transition-colors duration-200"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#DE0500]/60 bg-[#1B0B0B]">
                <GiNinjaStar className="h-2.5 w-2.5" />
              </span>
              Imaginative Ninja
            </button>
            <button type="button" aria-label="Insert image" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <FiImage className="h-[14px] w-[14px]" />
            </button>
            <button type="button" aria-label="Inspiration" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <PiLightbulbFilamentLight className="h-[14px] w-[14px]" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1 text-white/45 sm:flex-nowrap sm:gap-2">
            <button type="button" aria-label="Model options" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <FiCpu className="h-[14px] w-[14px]" />
            </button>
            <button type="button" aria-label="Change language" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <FiGlobe className="h-[14px] w-[14px]" />
            </button>
            <button type="button" aria-label="Attach file" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <FiPaperclip className="h-[14px] w-[14px]" />
            </button>
            <button type="button" aria-label="Voice input" className="flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
              <PiWaveformBold className="h-[14px] w-[14px]" />
            </button>

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
