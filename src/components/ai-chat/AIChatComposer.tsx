import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import { GiNinjaStar } from 'react-icons/gi';
import { FiGlobe, FiMic, FiPaperclip, FiImage, FiSend, FiCpu, FiZap } from 'react-icons/fi';

interface AIChatComposerProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => Promise<boolean> | boolean;
  placeholder?: string;
  isGenerating?: boolean;
  tokenUsage?: number;
  usageLimit?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const AIChatComposer: FC<AIChatComposerProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  placeholder = 'Ask me anything...',
  isGenerating = false,
  onKeyDown,
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
    <div className="mt-10 flex justify-center px-4">
      <div className="w-full max-w-full rounded-xl border border-[#242424] bg-[#151515] p-5 shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg sm:p-6 md:p-7">
        <div className="flex h-full flex-col gap-5">
          <textarea
            value={prompt}
            onChange={handleChange}
            onKeyDown={handleKeyDownInternal}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            aria-label="Chat prompt"
            className="min-h-[130px] w-full flex-1 resize-none border-none bg-transparent text-lg leading-8 text-white/70 placeholder:text-white/25 focus:outline-none sm:min-h-[150px] sm:text-xl"
          />

          <div className="flex flex-col gap-4 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-3 rounded-[14px] border border-[#FF0600] px-5 py-2 text-sm font-semibold text-[#FF0600] shadow-[0_12px_30px_rgba(222,5,0,0.25)] transition-colors duration-200"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#DE0500]/60 bg-[#1B0B0B]">
                  <GiNinjaStar className="h-3.5 w-3.5" />
                </span>
                Imaginative Ninja
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 text-white/45 sm:flex-nowrap sm:gap-3">
              <button type="button" aria-label="Insert image" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiImage className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Inspiration" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiZap className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Model options" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiCpu className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Change language" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiGlobe className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Attach file" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiPaperclip className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Voice input" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 hover:bg-white/5 hover:text-white">
                <FiMic className="h-[18px] w-[18px]" />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || !prompt.trim()}
                aria-label="Send message"
                className="ml-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#DE0500] text-white shadow-[0_20px_40px_rgba(222,5,0,0.45)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disabled ? (
                  <GiNinjaStar className="h-5 w-5 animate-spin" />
                ) : (
                  <FiSend className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatComposer;
