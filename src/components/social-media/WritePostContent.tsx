import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaWandMagicSparkles, FaPenNib } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { usePost } from "./PostContext";
import { CAPTION_LIMITS } from "../../constants/platforms";
import { socialMediaService } from "../../services/social-media";

const WritePostContent: React.FC = () => {
  const { postData, updateContent } = usePost();
  const platformCaptionLimits: Record<string, number> = useMemo(
    () => CAPTION_LIMITS,
    []
  );
  const effectiveMax = useMemo(() => {
    const selected = postData.selectedPlatforms;
    if (!selected || selected.length === 0) return 3000;
    const limits = selected.map((p) => platformCaptionLimits[p] ?? 3000);
    return Math.min(...limits);
  }, [postData.selectedPlatforms, platformCaptionLimits]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const previousContentRef = useRef<string>("");

  const [processingMode, setProcessingMode] = useState<
    "enhance" | "write" | null
  >(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autoResize(textareaRef.current);
  }, [autoResize, postData.content]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const isProcessing = Boolean(processingMode);

  const typeOutContent = useCallback(
    (text: string, onComplete?: () => void) => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      const cleaned = text ?? "";
      if (cleaned.length === 0) {
        updateContent("");
        requestAnimationFrame(() => autoResize(textareaRef.current));
        onComplete?.();
        return;
      }

      let index = 0;
      const total = cleaned.length;
      const step =
        total > 1200
          ? 6
          : total > 600
          ? 4
          : total > 240
          ? 3
          : total > 120
          ? 2
          : 1;

      const tick = () => {
        index = Math.min(index + step, total);
        updateContent(cleaned.slice(0, index));
        requestAnimationFrame(() => autoResize(textareaRef.current));

        if (index < total) {
          const delay =
            total > 1200 ? 6 : total > 600 ? 12 : total > 240 ? 16 : 24;
          typingTimeoutRef.current = window.setTimeout(tick, delay);
        } else {
          typingTimeoutRef.current = null;
          onComplete?.();
        }
      };

      updateContent("");
      requestAnimationFrame(() => autoResize(textareaRef.current));
      tick();
    },
    [autoResize, updateContent]
  );

  const resetProcessing = useCallback(() => {
    setProcessingMode(null);
    setStatusMessage(null);
    requestAnimationFrame(() => autoResize(textareaRef.current));
  }, [autoResize]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isProcessing) return;
    const value = e.target.value;
    if (value.length <= effectiveMax) {
      updateContent(value);
    }
    autoResize(e.currentTarget);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (isProcessing) {
      e.preventDefault();
      return;
    }
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;
    e.preventDefault();
    const target = e.currentTarget;
    const selStart = target.selectionStart ?? postData.content.length;
    const selEnd = target.selectionEnd ?? selStart;
    const before = postData.content.slice(0, selStart);
    const after = postData.content.slice(selEnd);
    const available = Math.max(
      0,
      effectiveMax - (before.length + after.length)
    );
    if (available === 0) return;
    const toInsert = pasted.slice(0, available);
    updateContent(before + toInsert + after);
    requestAnimationFrame(() => autoResize(textareaRef.current));
  };

  const handleEnhanceWithAI = async () => {
    if (isProcessing) return;
    if (!postData.content || postData.content.trim().length === 0) {
      toast.error("Add some content first so we know what to enhance.");
      return;
    }

    previousContentRef.current = postData.content;
    setProcessingMode("enhance");
    setStatusMessage("Enhancing your draft...");

    try {
      const response = await socialMediaService.enhanceWithAI({
        content: postData.content,
        platforms:
          postData.selectedPlatforms.length > 0
            ? postData.selectedPlatforms
            : undefined,
      });

      const enhancedRaw = response.data?.enhancedContent?.trim();
      if (!response.success || !enhancedRaw) {
        throw new Error(response.message || "Failed to enhance content");
      }

      const trimmed = enhancedRaw.slice(0, effectiveMax);
      const wasTrimmed = enhancedRaw.length > trimmed.length;
      setStatusMessage("Applying AI enhancements...");

      typeOutContent(trimmed, () => {
        resetProcessing();
        toast.success(
          wasTrimmed
            ? "Content enhanced! Trimmed to your platform limit."
            : "Content enhanced successfully!"
        );
      });
    } catch (error: any) {
      console.error("Enhance with AI error:", error);
      resetProcessing();
      updateContent(previousContentRef.current);
      toast.error(error?.message || "Failed to enhance content");
    }
  };

  const handleWriteWithAI = async () => {
    if (isProcessing) return;
    const prompt = postData.content.trim();
    if (!prompt) {
      toast.error(
        "Describe your idea in the field first, then tap Write with AI."
      );
      return;
    }

    previousContentRef.current = postData.content;
    setProcessingMode("write");
    setStatusMessage("Crafting a fresh post...");

    try {
      const response = await socialMediaService.writeWithAI({
        prompt,
        platforms:
          postData.selectedPlatforms.length > 0
            ? postData.selectedPlatforms
            : undefined,
      });

      const generatedRaw = response.data?.generatedContent?.trim();
      if (!response.success || !generatedRaw) {
        throw new Error(response.message || "Failed to generate content");
      }

      const trimmed = generatedRaw.slice(0, effectiveMax);
      const wasTrimmed = generatedRaw.length > trimmed.length;
      setStatusMessage("Writing your AI-crafted post...");

      typeOutContent(trimmed, () => {
        resetProcessing();
        toast.success(
          wasTrimmed
            ? "New post ready! Trimmed to platform limit."
            : "New post written!"
        );
      });
    } catch (error: any) {
      console.error("Write with AI error:", error);
      resetProcessing();
      updateContent(previousContentRef.current);
      toast.error(error?.message || "Failed to generate content");
    }
  };

  const aiStatusLabel =
    statusMessage ??
    (processingMode === "enhance"
      ? "Enhancing with AI..."
      : processingMode === "write"
      ? "Writing with AI..."
      : null);

  const hasContent = useMemo(
    () => postData.content.trim().length > 0,
    [postData.content]
  );
  const showEnhanceButton = hasContent || processingMode === "enhance";

  return (
    <div className="bg-[#0d0d0d] border border-[#222222] rounded-xl p-3 md:p-4">
      <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-plus-jakarta">
        Write Post Content
      </h3>

      <div className="mb-3 md:mb-4">
        <div className="relative">
          {processingMode && aiStatusLabel && (
            <div className="w-full flex justify-center mb-2">
              <div className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-gray-200 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                <span>{aiStatusLabel}</span>
              </div>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={postData.content}
            onChange={handleContentChange}
            onPaste={handlePaste}
            placeholder="Draft your post, or jot down an idea and let AI take it from there..."
            className={`w-full min-h-[96px] md:min-h-[80px]  bg-transparent border-none outline-none resize-none overflow-hidden text-white placeholder-gray-400 text-sm md:text-base leading-relaxed focus:outline-none px-3 transition-opacity duration-200 ${
              isProcessing ? "opacity-90" : "opacity-100"
            }`}
            rows={6}
            readOnly={isProcessing}
          />
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {postData.selectedPlatforms.length > 0 ? (
            <>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="text-gray-500">Caption limits:</span>
                {Array.from(new Set(postData.selectedPlatforms)).map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-gray-200"
                  >
                    <span className="capitalize">{p}</span>
                    <span>· {platformCaptionLimits[p] ?? 3000} chars</span>
                  </span>
                ))}
              </div>
              <div className="mt-1 text-gray-500">
                Current soft limit: {effectiveMax} characters.
              </div>
            </>
          ) : (
            <div>Tip: Select platforms to see their character limits.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {showEnhanceButton && (
            <button
              onClick={handleEnhanceWithAI}
              disabled={isProcessing}
              className={`inline-flex items-center justify-center gap-1.5 bg-[#1E1E1E] border ${
                processingMode === "enhance"
                  ? "border-red-600"
                  : "border-gray-700"
              } hover:bg-gray-700/20 disabled:opacity-50 disabled:cursor-not-allowed text-white w-44 md:w-48 h-9 md:h-10 whitespace-nowrap px-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-200`}
            >
              <FaWandMagicSparkles
                className={`w-3.5 h-3.5 ${
                  processingMode === "enhance" ? "animate-spin" : ""
                }`}
              />
              <span>
                {processingMode === "enhance" ? "Enhancing" : "Enhance with AI"}
              </span>
            </button>
          )}

          <button
            onClick={handleWriteWithAI}
            disabled={isProcessing}
            className={`inline-flex items-center justify-center gap-1.5 bg-[#1E1E1E] border ${
              processingMode === "write" ? "border-red-600" : "border-gray-700"
            } hover:bg-gray-700/20 disabled:opacity-50 disabled:cursor-not-allowed text-white w-44 md:w-48 h-9 md:h-10 whitespace-nowrap px-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-200`}
          >
            <FaPenNib
              className={`w-3.5 h-3.5 ${
                processingMode === "write" ? "animate-spin" : ""
              }`}
            />
            <span>
              {processingMode === "write" ? "Writing" : "Write with AI"}
            </span>
          </button>
        </div>

        <div className="text-gray-400 text-xs md:text-sm font-medium">
          {postData.content.length}/{effectiveMax} characters
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <span className="text-gray-300 font-medium">Pro tip:</span> Use this
        field for both drafts and prompts. Click
        <span className="text-gray-200"> Write with AI</span> to turn your idea
        into a post, or
        <span className="text-gray-200"> Enhance with AI</span> to polish what
        you already have.
      </div>
    </div>
  );
};

export default WritePostContent;
