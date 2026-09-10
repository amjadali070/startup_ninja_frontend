import React from "react";
import ReactMarkdown from "react-markdown";
// @ts-ignore - remark-gfm v4 ESM compatibility issue
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { FaArrowLeft, FaRobot, FaUser } from "react-icons/fa";
import type { AIChat, ExtendedUserDetails } from "../../../types/admin";

interface ChatDetailViewProps {
  selectedChat: AIChat;
  user: ExtendedUserDetails;
  setSelectedChat: (chat: AIChat | null) => void;
}

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const formatTime = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatDetailView: React.FC<ChatDetailViewProps> = ({
  selectedChat,
  user,
  setSelectedChat,
}) => {
  return (
    <div className="p-4 sm:p-6 max-w-full mx-auto animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => setSelectedChat(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <FaArrowLeft /> Back to AI Chats
        </button>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#242424]">
            <FaRobot className="text-blue-500 text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {selectedChat.title}
            </h2>
            <p className="text-gray-400">
              {user?.fullname || user?.username} • {selectedChat.messageCount}{" "}
              messages • Created{" "}
              {formatDate(selectedChat.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0D0D0D] rounded-xl border border-[#242424] p-6">
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {selectedChat.messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI Avatar on the left */}
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-white text-sm" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[75%] ${
                  message.role === "user"
                    ? "bg-red-600 text-white rounded-2xl rounded-tr-sm"
                    : "bg-[#1A1A1A] text-gray-200 rounded-2xl rounded-tl-sm border border-[#2A2A2A]"
                } px-4 py-3`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-medium ${
                      message.role === "user" ? "text-red-100" : "text-gray-400"
                    }`}
                  >
                    {message.role === "user"
                      ? user?.username || "User"
                      : "AI Assistant"}
                  </span>
                  <span
                    className={`text-xs ${
                      message.role === "user" ? "text-red-200" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                {message.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
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
                          <p
                            className="mb-2 last:mb-0 text-gray-200 break-words"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-outside mb-2 space-y-1 text-gray-200 ml-3 sm:ml-4 pl-2 break-words"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-outside mb-2 space-y-1 text-gray-200 ml-3 sm:ml-4 pl-2 break-words"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li
                            className="text-gray-200 pl-1 leading-relaxed break-words"
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
                            className="border-l-4 border-white/20 pl-3 sm:pl-4 my-2 italic text-gray-400 break-words"
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
                            className="italic text-gray-300 break-words"
                            {...props}
                          />
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

              {/* User Avatar on the right */}
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-white text-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatDetailView;
