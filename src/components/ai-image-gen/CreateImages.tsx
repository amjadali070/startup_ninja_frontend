import React, { useState, useEffect } from "react";
import { GiNinjaStar } from "react-icons/gi";
import {
  FiMaximize,
  FiLayers,
  FiCommand,
  FiSquare,
  FiMonitor,
  FiSmartphone,
  FiTv,
  FiLayout,
  FiCamera,
  FiSmile,
  FiImage,
  FiPenTool,
  FiEdit2,
  FiCpu,
} from "react-icons/fi";
import { imageGenService } from "../../services/imageGenService";
import { toast } from "react-hot-toast";

interface CreateImagesProps {
  onImageGenerated?: () => void;
}

const CreateImages: React.FC<CreateImagesProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("photorealistic");
  const [loadingText, setLoadingText] = useState("Initializing...");
  // State for tracking open dropdowns
  const [openSelect, setOpenSelect] = useState<"aspect" | "style" | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".custom-select-container")) {
        setOpenSelect(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const maxCharacters = 4000;

  // Rotating loading texts
  useEffect(() => {
    if (isGenerating) {
      const texts = [
        "Dreaming...",
        "Sketching...",
        "Adding colors...",
        "Polishing details...",
        "Finalizing masterpiece...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i]);
        i = (i + 1) % texts.length;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setLoadingText("Initializing...");
    try {
      await imageGenService.generateImage({
        prompt,
        aspectRatio,
        style,
      });
      toast.success("Image generated successfully!");
      setPrompt("");
      if (onImageGenerated) {
        onImageGenerated();
      }
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value.slice(0, maxCharacters));
  };

  const aspectRatioOptions = [
    { value: "1:1", label: "Square (1:1)", icon: FiSquare },
    { value: "16:9", label: "Widescreen (16:9)", icon: FiMonitor },
    { value: "4:3", label: "Standard (4:3)", icon: FiTv },
    { value: "3:4", label: "Portrait (3:4)", icon: FiLayout },
    { value: "9:16", label: "Story (9:16)", icon: FiSmartphone },
  ];

  const styleOptions = [
    { value: "photorealistic", label: "Photorealistic", icon: FiCamera },
    { value: "anime", label: "Anime", icon: FiSmile },
    { value: "digital-art", label: "Digital Art", icon: FiImage },
    { value: "oil-painting", label: "Oil Painting", icon: FiPenTool },
    { value: "sketch", label: "Sketch", icon: FiEdit2 },
    { value: "cyberpunk", label: "Cyberpunk", icon: FiCpu },
  ];

  return (
    <div className="w-full max-w-auto mx-auto mb-8">
      {/* Main Container */}
      <div className="relative w-full rounded-2xl border border-[#242424] bg-[#121212] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-[#242424] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#DC2626] rounded-xl shadow-sm border border-[#333]">
              <GiNinjaStar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-plus-jakarta">
                Generate Visual using Ninja Power
              </h1>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Controls Row */}
          <div className="flex flex-wrap gap-6">
            {/* Aspect Ratio Custom Select */}
            <div className="space-y-1.5 custom-select-container relative z-20">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FiMaximize className="w-3 h-3 text-gray-500" />
                Aspect Ratio
              </label>
              <div className="relative w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSelect(openSelect === "aspect" ? null : "aspect")
                  }
                  className={`w-auto min-w-[220px] bg-[#0D0D0D] text-left text-gray-200 border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors hover:border-gray-600 ${
                    openSelect === "aspect"
                      ? "border-gray-500"
                      : "border-[#242424]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const selected = aspectRatioOptions.find(
                        (opt) => opt.value === aspectRatio
                      );
                      const Icon = selected?.icon;
                      return (
                        <>
                          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                          <span className="truncate">{selected?.label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <svg
                    className={`w-2.5 h-2.5 text-gray-500 transition-transform ${
                      openSelect === "aspect" ? "rotate-180" : ""
                    }`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openSelect === "aspect" && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl overflow-hidden py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                    {aspectRatioOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setAspectRatio(opt.value);
                          setOpenSelect(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                          aspectRatio === opt.value
                            ? "bg-[#242424] text-white"
                            : "text-gray-400 hover:bg-[#242424] hover:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <opt.icon
                            className={`w-4 h-4 ${
                              aspectRatio === opt.value
                                ? "text-[#DC2626]"
                                : "text-gray-500 group-hover:text-gray-300"
                            }`}
                          />
                          <span>{opt.label}</span>
                        </div>
                        {aspectRatio === opt.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Art Style Custom Select */}
            <div className="space-y-1.5 custom-select-container relative z-10">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <FiLayers className="w-3 h-3 text-gray-500" />
                Art Style
              </label>
              <div className="relative w-fit">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSelect(openSelect === "style" ? null : "style")
                  }
                  className={`w-auto min-w-[220px] bg-[#0D0D0D] text-left text-gray-200 border rounded-xl px-4 py-3 text-sm flex items-center justify-between transition-colors hover:border-gray-600 ${
                    openSelect === "style"
                      ? "border-gray-500"
                      : "border-[#242424]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const selected = styleOptions.find(
                        (opt) => opt.value === style
                      );
                      const Icon = selected?.icon;
                      return (
                        <>
                          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                          <span className="truncate">{selected?.label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <svg
                    className={`w-2.5 h-2.5 text-gray-500 transition-transform ${
                      openSelect === "style" ? "rotate-180" : ""
                    }`}
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openSelect === "style" && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl overflow-hidden py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-[240px] overflow-y-auto custom-scrollbar">
                    {styleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStyle(opt.value);
                          setOpenSelect(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                          style === opt.value
                            ? "bg-[#242424] text-white"
                            : "text-gray-400 hover:bg-[#242424] hover:text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <opt.icon
                            className={`w-4 h-4 ${
                              style === opt.value
                                ? "text-[#DC2626]"
                                : "text-gray-500 group-hover:text-gray-300"
                            }`}
                          />
                          <span>{opt.label}</span>
                        </div>
                        {style === opt.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Area */}
          <div className="relative group/prompt">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              <FiCommand className="w-3 h-3 text-gray-500" />
              Prompt
            </label>
            <div
              className={`relative bg-[#0D0D0D] rounded-xl border ${
                isGenerating
                  ? "border-gray-700"
                  : "border-[#242424] focus-within:border-gray-500"
              }`}
            >
              <textarea
                value={prompt}
                onChange={handleInputChange}
                disabled={isGenerating}
                placeholder="Describe your imagination... (e.g., A cybernetic samurai meditating in a neon-lit zen garden)"
                className="w-full min-h-[120px] bg-transparent rounded-xl p-4 text-gray-200 text-base leading-relaxed placeholder:text-gray-600 resize-none focus:outline-none disabled:opacity-50"
              />
              <div className="flex justify-between items-center px-4 py-2 border-t border-[#1F1F1F]">
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  Ninja Tip: Be descriptive for better results
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    prompt.length > maxCharacters * 0.9
                      ? "text-red-400"
                      : "text-gray-600"
                  }`}
                >
                  {prompt.length} / {maxCharacters} chars
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="
                        w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2.5 px-6 py-3.5 
                        rounded-xl font-bold text-sm text-white
                        bg-[#DC2626] hover:bg-[#b91c1c] border border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#DC2626]
                    "
            >
              {isGenerating ? (
                <>
                  <GiNinjaStar className="w-4 h-4 animate-spin" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <GiNinjaStar className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateImages;
