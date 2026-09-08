import { useEffect, useRef, type FC } from "react";
import { ChatMessage as ChatMessageType } from "../../types/ai-content";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import AIChatHeroTitle from "./AIChatHeroTitle";

interface ChatMessagesListProps {
  messages: ChatMessageType[];
  isGenerating: boolean;
  userProfilePicture?: string | null;
  error?: string | null;
  followUps?: string[];
  onEditMessage?: (messageId: string, currentContent: string) => void;
  onRegenerate?: () => void;
  onSaveMemory?: (content: string) => void;
  onFollowUpClick?: (prompt: string) => void;
}

const ChatMessagesList: FC<ChatMessagesListProps> = ({
  messages,
  isGenerating,
  userProfilePicture,
  error,
  followUps,
  onEditMessage,
  onRegenerate,
  onSaveMemory,
  onFollowUpClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const scrollToBottom = (instant = false) => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;

      if (instant) {
        containerRef.current.scrollTop = maxScrollTop;
      } else {
        containerRef.current.scrollTo({
          top: maxScrollTop,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // If user is within 50px of bottom, enable auto-scroll
      const isAtBottom = scrollHeight - scrollTop - clientHeight <= 50;
      shouldAutoScrollRef.current = isAtBottom;
    }
  };

  // Auto-scroll on new messages if user is at bottom
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      // During generation, use instant scroll to prevent "fighting" and glitches
      // This keeps the text anchored to the bottom firmly
      scrollToBottom(true);
    }
  }, [messages]);

  // Force scroll when generation starts
  useEffect(() => {
    if (isGenerating) {
      shouldAutoScrollRef.current = true;
      scrollToBottom(true);
    }
  }, [isGenerating]);

  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant" && messages[i].content) return i;
    }
    return -1;
  })();

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto chat-messages-scrollbar pr-2"
    >
      <div className="flex flex-col gap-4 px-2 py-4 pb-6 w-full">
        {messages.length === 0 && !isGenerating && (
          <div className="mt-4">
            <AIChatHeroTitle />
          </div>
        )}

        {messages.length > 0 && (
          <>
            {messages
              .filter((msg) => msg.content || msg.role === "user")
              .map((message, index, array) => {
                if (message.content && message.content.length > 0) {
                  const contentHash = message.content
                    .substring(0, 100)
                    .replace(/\s+/g, " ")
                    .trim();
                  const timestamp = message.timestamp || "";

                  const stableKey = `${message.role}-${contentHash.substring(
                    0,
                    50
                  )}-${timestamp || index}`;
                  return (
                    <ChatMessage
                      key={stableKey}
                      message={message}
                      userProfilePicture={userProfilePicture}
                      isLastAssistantMessage={index === lastAssistantIndex}
                      onEdit={onEditMessage}
                      onRegenerate={message.role === "assistant" ? onRegenerate : undefined}
                      onSaveMemory={message.role === "assistant" ? onSaveMemory : undefined}
                      isGenerating={isGenerating}
                    />
                  );
                }

                const prevMessage = index > 0 ? array[index - 1] : null;
                const prevContentHash = prevMessage?.content
                  ? prevMessage.content
                      .substring(0, 30)
                      .replace(/\s+/g, " ")
                      .trim()
                  : "start";
                const typingKey = `${message.role}-typing-${prevContentHash}-${index}`;

                return (
                  <ChatMessage
                    key={typingKey}
                    message={message}
                    userProfilePicture={userProfilePicture}
                  />
                );
              })}
          </>
        )}

        {/* Only show typing indicator if we are generating AND the last message is not an assistant message with content (meaning we are not yet streaming the response) */}
        {isGenerating && (!messages.length || messages[messages.length - 1].role !== 'assistant' || !messages[messages.length - 1].content) && (
          <TypingIndicator />
        )}

        {/* Suggested follow-up prompts, shown after the latest response settles */}
        {!isGenerating && followUps && followUps.length > 0 && onFollowUpClick && (
          <div className="flex flex-wrap gap-2 pl-9 sm:pl-11">
            {followUps.map((prompt, i) => (
              <button
                key={i}
                data-testid="follow-up-chip"
                onClick={() => onFollowUpClick(prompt)}
                className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/70 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-2 w-full rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatMessagesList;
