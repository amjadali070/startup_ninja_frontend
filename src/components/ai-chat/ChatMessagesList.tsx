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
}

const ChatMessagesList: FC<ChatMessagesListProps> = ({
  messages,
  isGenerating,
  userProfilePicture,
  error,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto chat-messages-scrollbar pr-2"
    >
      <div className="flex flex-col gap-4 px-2 py-4 pb-6 w-full">
        {messages.length === 0 && !isGenerating && (
          <div className="mt-4">
            <AIChatHeroTitle />
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <>
            {messages
              .filter((msg) => msg.content || msg.role === "user") // Filter out empty assistant messages
              .map((message, index) => (
                <ChatMessage
                  key={`${message.role}-${index}-${
                    message.content?.substring(0, 20) || index
                  }`}
                  message={message}
                  userProfilePicture={userProfilePicture}
                />
              ))}
          </>
        )}

        {/* Typing Indicator */}
        {isGenerating && <TypingIndicator />}

        {/* Error Display */}
        {error && (
          <div className="mt-2 w-full rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Scroll anchor with extra spacing */}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatMessagesList;
