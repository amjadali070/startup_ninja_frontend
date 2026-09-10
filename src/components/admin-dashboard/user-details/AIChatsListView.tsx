import React from "react";
import { FaRobot, FaArrowLeft } from "react-icons/fa";
import type { AIChat } from "../../../types/admin";

interface AIChatsListViewProps {
  aiChats: AIChat[];
  setSelectedChat: (chat: AIChat) => void;
}

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const AIChatsListView: React.FC<AIChatsListViewProps> = ({
  aiChats,
  setSelectedChat,
}) => {
  if (aiChats.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">No AI chats found</div>
    );
  }

  return (
    <div className="space-y-4">
      {aiChats.map((chat) => (
        <div
          key={chat._id}
          className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] hover:border-[#444] transition-colors cursor-pointer"
          onClick={() => setSelectedChat(chat)}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-white font-semibold text-lg">{chat.title}</h4>
            <span className="text-sm text-gray-500">
              {formatDate(chat.lastMessageAt)}
            </span>
          </div>

          {/* Show last message preview */}
          {chat.messages.length > 0 && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {chat.messages[chat.messages.length - 1]?.content ||
                "No messages"}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-[#242424] pt-4">
            <span className="flex items-center gap-2">
              <FaRobot className="text-blue-500" /> AI Chat
            </span>
            <span>{chat.messageCount} messages</span>
            <span className="text-xs">
              Created: {formatDate(chat.createdAt)}
            </span>
            <button className="ml-auto text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View Full Chat <FaArrowLeft className="rotate-180" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIChatsListView;
