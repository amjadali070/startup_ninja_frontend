import { useState, type FC } from "react";
import ReactMarkdown from "react-markdown";
// @ts-ignore - remark-gfm v4 ESM compatibility issue
import remarkGfm from "remark-gfm";
import { MdCopyAll, MdCheck } from "react-icons/md";
import { FiEdit2, FiRefreshCw, FiExternalLink, FiFileText, FiBookmark } from "react-icons/fi";
import rehypeHighlight from "rehype-highlight";
import { ChatMessage as ChatMessageType } from "../../types/ai-content";
import "highlight.js/styles/github-dark.css";

interface ChatMessageProps {
  message: ChatMessageType;
  userProfilePicture?: string | null;
  isLastAssistantMessage?: boolean;
  onEdit?: (messageId: string, currentContent: string) => void;
  onRegenerate?: () => void;
  onSaveMemory?: (content: string) => void;
  isGenerating?: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({
  message,
  userProfilePicture,
  isLastAssistantMessage,
  onEdit,
  onRegenerate,
  onSaveMemory,
  isGenerating,
}) => {
  const isUser = message.role === "user";
  const [userImageError, setUserImageError] = useState(false);
  const [ninjaImageError, setNinjaImageError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const timestampDate = message.timestamp ? new Date(message.timestamp) : null;
  const timestampLabel =
    timestampDate && !Number.isNaN(timestampDate.getTime())
      ? timestampDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (!isUser && !message.content) {
    return null;
  }

  // Only the last assistant message can still be mid-typewriter-reveal —
  // copying or saving-to-memory while it's revealing would capture the
  // truncated partial text rather than the final answer.
  const isRevealingThisMessage = !isUser && Boolean(isLastAssistantMessage) && Boolean(isGenerating);

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden border border-white/10 bg-[#1A1A1A]">
            {userProfilePicture && !userImageError ? (
              <img
                src={userProfilePicture}
                alt="User"
                className="h-full w-full object-cover"
                onError={() => setUserImageError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-white/60 font-semibold bg-[#DE0500]/20">
                U
              </div>
            )}
          </div>
        ) : (
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full overflow-hidden border border-white/10 bg-[#1A1A1A] flex items-center justify-center">
            {!ninjaImageError ? (
              <img
                src="/svg/ninja-spinner.svg"
                alt="Ninja Assistant"
                className="h-4 w-4 sm:h-5 sm:w-5"
                onError={() => setNinjaImageError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-[#DE0500] font-bold">
                N
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className={`flex flex-col min-w-0 ${
          isUser ? "items-end" : "items-start"
        } max-w-[85%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]`}
      >
        {/* Attachments (user messages) */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5 justify-end">
            {message.attachments.map((att, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/70"
                title={att.filename}
              >
                <FiFileText className="h-3 w-3 flex-shrink-0" />
                <span className="max-w-[140px] truncate">{att.filename}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`relative rounded-lg px-3 sm:px-4 py-2 sm:py-3 break-words overflow-wrap-anywhere ${
            isUser
              ? "bg-[#DE0500] text-white rounded-tr-sm"
              : "bg-[#1A1A1A] border border-white/10 text-white/90 rounded-tl-sm pr-10"
          }`}
        >
          {/* Copy button for AI responses */}
          {!isUser && !isRevealingThisMessage && (
            <button
              onClick={handleCopyResponse}
              className="absolute top-2 right-2 p-1.5 rounded hover:bg-white/10 transition-colors group z-10"
              title={isCopied ? "Copied!" : "Copy response"}
            >
              {isCopied ? (
                <MdCheck className="h-4 w-4 text-green-500" />
              ) : (
                <MdCopyAll className="h-4 w-4 text-white/50 group-hover:text-white/80" />
              )}
            </button>
          )}
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none break-words [&_*]:break-words [&_p]:break-words [&_li]:break-words pr-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-base sm:text-lg font-bold mt-3 sm:mt-4 mb-2 text-white break-words"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-sm sm:text-base font-bold mt-2 sm:mt-3 mb-2 text-white break-words"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-sm font-semibold mt-2 sm:mt-3 mb-1.5 text-white break-words"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-2 last:mb-0 text-white/90 break-words"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-outside mb-2 space-y-1 text-white/90 ml-3 sm:ml-4 pl-2 break-words"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-outside mb-2 space-y-1 text-white/90 ml-3 sm:ml-4 pl-2 break-words"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-white/90 pl-1 leading-relaxed break-words"
                      {...props}
                    />
                  ),
                  code: ({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }: any) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <pre className="bg-[#0A0A0A] border border-white/10 rounded-md my-2 overflow-x-auto">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code
                        className="bg-[#0A0A0A] border border-white/10 rounded px-1.5 py-0.5 text-xs text-[#DE0500] font-mono break-words"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-white/20 pl-3 sm:pl-4 my-2 italic text-white/70 break-words"
                      {...props}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#DE0500] hover:text-[#FF3B3B] underline break-words"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="font-semibold text-white break-words"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em
                      className="italic text-white/90 break-words"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="border-white/10 my-4" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-2 rounded-md border border-white/10">
                      <table className="w-full text-xs sm:text-sm border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-white/5" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-white/5" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b border-white/5 last:border-0" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="text-left font-semibold text-white px-3 py-2 border-r border-white/5 last:border-r-0 whitespace-nowrap"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="text-white/80 px-3 py-2 border-r border-white/5 last:border-r-0 align-top"
                      {...props}
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {message.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                title={source.snippet || source.title}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/60 hover:text-white/90 transition-colors max-w-[220px]"
              >
                <FiExternalLink className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{source.title || source.url}</span>
              </a>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center gap-2 px-1">
          {timestampLabel && (
            <span className="text-xs text-white/40">
              {timestampLabel}
            </span>
          )}
          {isUser && message.edited && (
            <span className="text-[10px] text-white/30 italic">edited</span>
          )}
          {message.source && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                message.source === "dataset"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}
            >
              {message.source === "dataset" ? "Cached" : "AI"}
            </span>
          )}

          {/* Edit Prompt (user messages) */}
          {isUser && onEdit && message._id && !isGenerating && (
            <button
              onClick={() => onEdit(message._id!, message.content)}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              title="Edit and resend"
            >
              <FiEdit2 className="h-3 w-3" />
            </button>
          )}

          {/* Regenerate (last assistant message only) */}
          {!isUser && isLastAssistantMessage && onRegenerate && !isGenerating && (
            <button
              onClick={onRegenerate}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              title="Regenerate response"
            >
              <FiRefreshCw className="h-3 w-3" />
            </button>
          )}

          {/* Remember this (assistant messages) */}
          {!isUser && onSaveMemory && !isRevealingThisMessage && (
            <button
              onClick={() => onSaveMemory(message.content)}
              className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
              title="Remember this"
            >
              <FiBookmark className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
