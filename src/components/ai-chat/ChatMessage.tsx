import { useState, type FC } from "react";
import ReactMarkdown from "react-markdown";
// @ts-ignore - remark-gfm v4 ESM compatibility issue
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ChatMessage as ChatMessageType } from "../../types/ai-content";
import "highlight.js/styles/github-dark.css";

interface ChatMessageProps {
  message: ChatMessageType;
  userProfilePicture?: string | null;
}

const ChatMessage: FC<ChatMessageProps> = ({ message, userProfilePicture }) => {
  const isUser = message.role === "user";
  const [userImageError, setUserImageError] = useState(false);
  const [ninjaImageError, setNinjaImageError] = useState(false);

  if (!isUser && !message.content) {
    return null;
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-[#1A1A1A]">
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
          <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-[#1A1A1A] flex items-center justify-center">
            {!ninjaImageError ? (
              <img
                src="/svg/ninja-icon.svg"
                alt="Ninja Assistant"
                className="h-5 w-5"
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
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        } max-w-[75%] sm:max-w-[70%] md:max-w-[65%]`}
      >
        <div
          className={`rounded-lg px-4 py-3 ${
            isUser
              ? "bg-[#DE0500] text-white rounded-tr-sm"
              : "bg-[#1A1A1A] border border-white/10 text-white/90 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Style headings
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-lg font-bold mt-4 mb-2 text-white"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-base font-bold mt-3 mb-2 text-white"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-sm font-semibold mt-3 mb-1.5 text-white"
                      {...props}
                    />
                  ),
                  // Style paragraphs
                  p: ({ node, ...props }) => (
                    <p className="mb-2 last:mb-0 text-white/90" {...props} />
                  ),
                  // Style lists
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-outside mb-2 space-y-1 text-white/90 ml-4 pl-2"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-outside mb-2 space-y-1 text-white/90 ml-4 pl-2"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-white/90 pl-1 leading-relaxed"
                      {...props}
                    />
                  ),
                  // Style code blocks
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
                        className="bg-[#0A0A0A] border border-white/10 rounded px-1.5 py-0.5 text-xs text-[#DE0500] font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Style blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-white/20 pl-4 my-2 italic text-white/70"
                      {...props}
                    />
                  ),
                  // Style links
                  a: ({ node, ...props }) => (
                    <a
                      className="text-[#DE0500] hover:text-[#FF3B3B] underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  // Style strong/bold
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-white" {...props} />
                  ),
                  // Style emphasis/italic
                  em: ({ node, ...props }) => (
                    <em className="italic text-white/90" {...props} />
                  ),
                  // Style horizontal rules
                  hr: ({ node, ...props }) => (
                    <hr className="border-white/10 my-4" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {message.timestamp && (
          <span className="mt-1 text-xs text-white/40 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
