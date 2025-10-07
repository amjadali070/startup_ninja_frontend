import type { FC } from 'react';
import { GiNinjaStar } from 'react-icons/gi';
import { FiGlobe, FiMic, FiPaperclip, FiImage, FiArrowUpRight } from 'react-icons/fi';

const AIChatComposer: FC = () => {
  return (
    <div className="mt-10 flex justify-center">
      <div className="w-full max-w-4xl rounded-[30px] border border-white/10 bg-[#101018] px-6 py-7 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="rounded-2xl border border-white/5 bg-[#090910] px-6 py-6 text-white/70">
          <p className="text-base text-white/55">Ask me anything...</p>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#161621] px-4 py-1 text-sm font-medium text-white">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4D4D]/20 text-[#FF4D4D]">
                  <GiNinjaStar className="h-3 w-3" />
                </span>
                Imaginative Ninja
              </span>

              <button
                type="button"
                className="rounded-full bg-[#161621] px-3 py-1 text-xs text-white/40 transition-colors duration-200 hover:text-white"
              >
                Change style
              </button>
            </div>

            <div className="flex items-center gap-3 text-white/50">
              <button type="button" aria-label="Language options" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161621] text-white/60 transition-all duration-200 hover:text-white">
                <FiGlobe className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Voice input" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161621] text-white/60 transition-all duration-200 hover:text-white">
                <FiMic className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Insert image" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161621] text-white/60 transition-all duration-200 hover:text-white">
                <FiImage className="h-[18px] w-[18px]" />
              </button>
              <button type="button" aria-label="Attach file" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#161621] text-white/60 transition-all duration-200 hover:text-white">
                <FiPaperclip className="h-[18px] w-[18px]" />
              </button>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4D4D] text-white shadow-[0_10px_30px_rgba(255,77,77,0.45)] transition-transform duration-200 hover:scale-105"
                aria-label="Send prompt"
              >
                <FiArrowUpRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatComposer;
