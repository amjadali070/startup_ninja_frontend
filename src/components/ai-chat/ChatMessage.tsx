import { useState, type FC } from "react";
import { ChatMessage as ChatMessageType } from "../../types/ai-content";

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
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
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
