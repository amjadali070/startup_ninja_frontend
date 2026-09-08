import type { ChangeEvent, DragEvent, FC, KeyboardEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { GiNinjaStar } from "react-icons/gi";
import { FaPlus } from "react-icons/fa6";
import { IoSend, IoStop } from "react-icons/io5";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { FiPaperclip, FiX, FiFileText, FiSearch } from "react-icons/fi";

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".xlsx",
  ".csv",
  ".txt",
  ".pptx",
  ".jpg",
  ".jpeg",
  ".png",
];
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 20;

interface AIChatComposerProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => Promise<boolean> | boolean;
  onNewChat?: () => void;
  placeholder?: string;
  isGenerating?: boolean;
  tokenUsage?: number;
  onExportPdf?: () => void;
  onExportDocx?: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  selectedFiles?: File[];
  onFilesSelected?: (files: File[]) => void;
  onRemoveFile?: (index: number) => void;
  onStopGenerating?: () => void;
  enableSearch?: boolean;
  onToggleSearch?: () => void;
  uploadProgress?: number | null;
}

const AIChatComposer: FC<AIChatComposerProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  onNewChat,
  placeholder = "Ask me anything...",
  isGenerating = false,
  onExportPdf,
  onExportDocx,
  onKeyDown,
  className,
  selectedFiles = [],
  onFilesSelected,
  onRemoveFile,
  onStopGenerating,
  enableSearch = false,
  onToggleSearch,
  uploadProgress = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isGenerating && !isSubmitting) {
      const timeoutId = setTimeout(() => {
        textareaRef.current?.focus();
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [isGenerating, isSubmitting]);

  useEffect(() => {
    if (!fileError) return;
    const timeoutId = setTimeout(() => setFileError(null), 4000);
    return () => clearTimeout(timeoutId);
  }, [fileError]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(event.target.value);
  };

  const validateAndAddFiles = (incoming: FileList | File[]) => {
    if (!onFilesSelected) return;
    const files = Array.from(incoming);
    const valid: File[] = [];

    for (const file of files) {
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.includes(ext)) {
        setFileError(`${file.name}: unsupported file type`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(`${file.name}: exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }
      valid.push(file);
    }

    if (selectedFiles.length + valid.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files per message`);
      valid.splice(MAX_FILES - selectedFiles.length);
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      validateAndAddFiles(event.target.files);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!onFilesSelected) return;
    if (event.dataTransfer.files?.length) {
      validateAndAddFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!onFilesSelected) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleStopClick = () => {
    // The original onSubmit() promise is still awaiting its network call
    // (there's no real cancellation, see plan.md's Stop Generation scoping
    // note) — its own `finally` won't clear isSubmitting until that
    // resolves. Reset it here too so the composer re-enables immediately
    // instead of staying disabled until the late response eventually lands.
    setIsSubmitting(false);
    onStopGenerating?.();
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
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative w-full rounded-2xl border p-2 shadow-[0_24px_120px_rgba(5,5,10,0.65)] backdrop-blur-lg sm:p-4 md:p-5 transition-colors ${
        isDragging
          ? "border-[#DE0500] bg-[#1A1A1A]"
          : "border-[#242424] bg-[#151515]"
      } ${className ?? ""}`}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-[#0A0A0A]/80 border-2 border-dashed border-[#DE0500]">
          <p className="text-sm font-medium text-white/80">
            Drop files to attach
          </p>
        </div>
      )}

      <div className="flex h-full flex-col">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={SUPPORTED_EXTENSIONS.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pb-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/70"
              >
                <FiFileText className="h-3 w-3 flex-shrink-0" />
                <span className="max-w-[140px] truncate">{file.name}</span>
                {onRemoveFile && !disabled && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(index)}
                    className="text-white/40 hover:text-white/80"
                    aria-label={`Remove ${file.name}`}
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {fileError && (
          <p className="pb-2 text-xs text-red-400">{fileError}</p>
        )}

        {uploadProgress !== null && (
          <div className="pb-2">
            <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
              <span>
                {uploadProgress < 100
                  ? "Uploading files…"
                  : "Processing document(s)…"}
              </span>
              {uploadProgress < 100 && <span>{uploadProgress}%</span>}
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#DE0500] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

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

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1">
            {onFilesSelected && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || selectedFiles.length >= MAX_FILES}
                className="inline-flex items-center justify-center h-9 w-9 sm:h-8 sm:w-8 rounded-[14px] border border-white/20 text-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white"
                title="Attach files"
                aria-label="Attach files"
              >
                <FiPaperclip className="h-3.5 w-3.5" />
              </button>
            )}

            {onToggleSearch && (
              <button
                type="button"
                onClick={onToggleSearch}
                disabled={disabled}
                className={`inline-flex items-center gap-2 rounded-[14px] border px-3 py-2 sm:py-1.5 text-xs font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  enableSearch
                    ? "border-[#DE0500] text-[#DE0500] bg-[#DE0500]/10"
                    : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title="Toggle web search"
                aria-pressed={enableSearch}
                aria-label="Toggle web search"
              >
                <FiSearch className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            )}

            {onNewChat && (
              <button
                type="button"
                onClick={onNewChat}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-[14px] border border-[#FF0600] px-3 py-2 sm:py-1.5 text-xs font-semibold text-[#FF0600] shadow-[0_12px_30px_rgba(222,5,0,0.25)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF0600]/10"
                aria-label="New chat"
              >
                <FaPlus className="h-3.5 w-3.5" />
                New Chat
              </button>
            )}
            
            {onExportPdf && (
              <button
                type="button"
                onClick={onExportPdf}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white"
                title="Export to PDF"
                aria-label="Export to PDF"
              >
                <FaFilePdf className="h-3.5 w-3.5 text-red-400" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}

            {onExportDocx && (
              <button
                type="button"
                onClick={onExportDocx}
                disabled={disabled}
                className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 px-3 py-2 sm:py-1.5 text-xs font-semibold text-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 hover:text-white"
                title="Export to DOCX"
                aria-label="Export to DOCX"
              >
                <FaFileWord className="h-3.5 w-3.5 text-blue-400" />
                <span className="hidden sm:inline">DOCX</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 text-white/45">
            {isGenerating && onStopGenerating ? (
              <button
                type="button"
                onClick={handleStopClick}
                aria-label="Stop generating"
                title="Stop generating"
                className="ml-1 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white transition-transform duration-200 hover:scale-105"
              >
                <IoStop className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || !prompt.trim()}
                aria-label="Send message"
                className="ml-1 flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#DE0500] text-white shadow-[0_20px_40px_rgba(222,5,0,0.45)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disabled ? (
                  <GiNinjaStar className="h-4 w-4 animate-spin" />
                ) : (
                  <IoSend className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatComposer;
