import React from "react";
import type { ChatMessage as ChatMessageType } from "../../types/ai-content";
import ChatMessageBubble from "../ai-chat/ChatMessage";
import TypingIndicator from "../ai-chat/TypingIndicator";
import LoadingSpinner from "../LoadingSpinner";

interface ChatbotMessagesProps {
  messages: ChatMessageType[];
  isHistoryLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  userProfilePicture?: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatbotMessages: React.FC<ChatbotMessagesProps> = ({
  messages,
  isHistoryLoading,
  isGenerating,
  error,
  userProfilePicture,
  messagesEndRef,
}) => (
  <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 custom-scrollbar hide-scrollbar">
    <div className="flex w-full flex-col gap-4 overflow-x-hidden pb-10 pr-1">
      {isHistoryLoading ? (
        <div className="flex justify-center py-6 text-sm text-white/50">
          <LoadingSpinner size="small" />
        </div>
      ) : messages.length === 0 && !isGenerating ? (
        <div className="mt-6 flex flex-col items-center text-center text-white/45">
          <p className="text-sm sm:text-base">Ask anything to get started.</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const key = `${message.role}-${index}-${String(
            message.timestamp ?? message.content
          ).slice(0, 32)}`;

          return (
            <div
              key={key}
              className="w-full break-words whitespace-pre-wrap [&>*]:break-words [&_*]:break-words [&>div]:w-full [&>div>div:nth-child(2)]:max-w-full [&>div>div:nth-child(2)]:break-words [&>div>div:nth-child(2)]:sm:max-w-full"
            >
              <ChatMessageBubble
                message={message}
                userProfilePicture={userProfilePicture}
              />
            </div>
          );
        })
      )}

      {isGenerating && <TypingIndicator />}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  </div>
);

export default ChatbotMessages;

