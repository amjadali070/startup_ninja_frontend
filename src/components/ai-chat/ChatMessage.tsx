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
    <div className={`flex gap-2 sm:gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
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
        <div
          className={`rounded-lg px-3 sm:px-4 py-2 sm:py-3 break-words overflow-wrap-anywhere ${
            isUser
              ? "bg-[#DE0500] text-white rounded-tr-sm"
              : "bg-[#1A1A1A] border border-white/10 text-white/90 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap leading-relaxed break-words overflow-wrap-anywhere">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none break-words [&_*]:break-words [&_p]:break-words [&_li]:break-words">
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
                    <p className="mb-2 last:mb-0 text-white/90 break-words" {...props} />
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
                    <strong className="font-semibold text-white break-words" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-white/90 break-words" {...props} />
                  ),
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
