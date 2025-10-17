import React, { useEffect, useMemo, useRef } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { usePost } from './PostContext';

const WritePostContent: React.FC = () => {
  const { postData, updateContent } = usePost();
  // Platform caption limits (soft enforcement in editor; hard checks happen before publish/schedule)
  const platformCaptionLimits: Record<string, number> = useMemo(() => ({
    x: 280,
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
  }), []);
  const effectiveMax = useMemo(() => {
    const selected = postData.selectedPlatforms;
    if (!selected || selected.length === 0) return 3000; // default upper bound
    const limits = selected.map(p => platformCaptionLimits[p] ?? 3000);
    return Math.min(...limits);
  }, [postData.selectedPlatforms, platformCaptionLimits]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= effectiveMax) {
      updateContent(value);
    }
    autoResize(e.currentTarget);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return; // let default handle if empty
    e.preventDefault();
    const target = e.currentTarget;
    const selStart = target.selectionStart ?? postData.content.length;
    const selEnd = target.selectionEnd ?? selStart;
    const before = postData.content.slice(0, selStart);
    const after = postData.content.slice(selEnd);
    const available = Math.max(0, effectiveMax - (before.length + after.length));
    if (available === 0) return; // no room left
    const toInsert = pasted.slice(0, available);
    updateContent(before + toInsert + after);
    // schedule resize after state update renders
    requestAnimationFrame(() => autoResize(textareaRef.current));
  };

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [postData.content]);

  const handleEnhanceWithAI = () => {
    console.log('Enhance with AI clicked');
  };

  const handleWriteWithAI = () => {
    console.log('Write with AI clicked');
  };

  return (
    <div className="bg-[#0d0d0d] border border-[#222222] rounded-xl p-3 md:p-4">
      <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-plus-jakarta">
        Write Post Content
      </h3>

      <div className="mb-3 md:mb-4">
        <textarea
          ref={textareaRef}
          value={postData.content}
          onChange={handleContentChange}
          onPaste={handlePaste}
          placeholder="What's on your mind? Let AI help you craft the perfect post..."
          className="w-full min-h-[96px] md:min-h-[80px] bg-transparent border-none outline-none resize-none overflow-hidden 
                     text-white placeholder-gray-400 text-sm md:text-base leading-relaxed
                     focus:outline-none"
          rows={4}
        />
        {/* Guidance for limits based on selected platforms */}
        <div className="mt-2 text-xs text-gray-400">
          {postData.selectedPlatforms.length > 0 ? (
            <>
             
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                 <div>Caption limits:</div>
                {Array.from(new Set(postData.selectedPlatforms)).map(p => (
                  <span key={p} className="inline-flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-0.5">
                    <span className="capitalize">{p}</span>
                    <span>· {platformCaptionLimits[p] ?? 3000} chars</span>
                  </span>
                ))}
              </div>
              <div className="mt-1">Applied limit now: {effectiveMax} characters.</div>
            </>
          ) : (
            <div>Tip: Select platforms to see their caption limits.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEnhanceWithAI}
            className="inline-flex items-center gap-1.5 
                       bg-[#1E1E1E] border-2 border-red-600 
                       hover:bg-red-600/10 
                       text-white 
                       px-3 py-2 md:px-4 md:py-2.5
                       rounded-lg 
                       text-xs md:text-sm
                       font-medium 
                       transition-all duration-200
                       min-h-[36px] md:min-h-[40px]"
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            <span>Enhance with AI</span>
          </button>

          <button
            onClick={handleWriteWithAI}
            className="inline-flex items-center gap-1.5
                       bg-[#1E1E1E] border border-gray-500 
                       hover:bg-gray-700/20 
                       text-white 
                       px-3 py-2 md:px-4 md:py-2.5
                       rounded-lg 
                       text-xs md:text-sm
                       font-medium 
                       transition-all duration-200
                       min-h-[36px] md:min-h-[40px]"
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            <span>Write with AI</span>
          </button>
        </div>

        <div className="text-gray-400 text-xs md:text-sm font-medium">
          {postData.content.length}/{effectiveMax} characters
        </div>
      </div>
    </div>
  );
};

export default WritePostContent;