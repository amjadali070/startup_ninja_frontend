import { useEffect, useMemo, useState } from "react";
import { FiX, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import type { Chat } from "../../types/ai-content";

interface ChatHistoryPanelProps {
  chats: Chat[];
  currentChatId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat?: (
    chatId: string,
    newTitle: string
  ) => Promise<boolean> | boolean;
}

const formatTime = (iso?: string | Date): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  chats,
  currentChatId,
  isOpen,
  onClose,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setEditingChatId(null);
      setDraftTitle("");
    }
  }, [isOpen]);

  const groupedChats = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    });

    const todayLabel = "Today";
    const yesterdayLabel = "Yesterday";
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    return chats.reduce<Record<string, Chat[]>>((acc, chat) => {
      const lastDate = chat.lastMessageAt || chat.updatedAt || chat.createdAt;
      if (!lastDate) {
        acc.other = [...(acc.other ?? []), chat];
        return acc;
      }

      const date = new Date(lastDate);
      let label = formatter.format(date);
      if (date.toDateString() === now.toDateString()) {
        label = todayLabel;
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = yesterdayLabel;
      }

      acc[label] = [...(acc[label] ?? []), chat];
      return acc;
    }, {});
  }, [chats]);

  const handleSaveRename = async (chatId: string) => {
    if (!onRenameChat) {
      setEditingChatId(null);
      setDraftTitle("");
      return;
    }

    const trimmed = draftTitle.trim();
    if (!trimmed) {
      return;
    }

    const result = await onRenameChat(chatId, trimmed);
    if (result) {
      setEditingChatId(null);
      setDraftTitle("");
    }
  };

  return (
    <aside
      className={`flex h-full flex-col overflow-hidden bg-[#0D0D12] transition-all duration-300 ease-in-out ${
        isOpen
          ? "pointer-events-auto opacity-100 border-r border-white/10 w-full sm:w-[260px]"
          : "pointer-events-none opacity-0 border-r border-transparent w-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-white">
              Chat history
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Close chat history"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto px-2 py-2 sm:py-3 hide-scrollbar">
          {chats.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#111118] px-4 py-6 text-center text-xs text-white/45">
              No chats yet. Start a conversation.
            </div>
          ) : (
            Object.entries(groupedChats).map(([label, grouped]) => (
              <div key={label} className="space-y-2">
                {label !== "other" && (
                  <p className="px-1 sm:px-2 text-[9px] sm:text-[10px] uppercase tracking-wide text-white/35">
                    {label}
                  </p>
                )}
                <div className="space-y-1 hide-scrollbar">
                  {grouped.map((chat) => (
                    <div
                      key={chat._id}
                      className={`group flex items-center justify-between rounded-xl border px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${
                        currentChatId === chat._id
                          ? "border-[#DE0500]/40 bg-[#DE0500]/10"
                          : "border-transparent hover:border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex-1 truncate text-left">
                        {editingChatId === chat._id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              type="text"
                              value={draftTitle}
                              onChange={(event) =>
                                setDraftTitle(event.target.value)
                              }
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  void handleSaveRename(chat._id);
                                } else if (event.key === "Escape") {
                                  event.preventDefault();
                                  setEditingChatId(null);
                                  setDraftTitle("");
                                }
                              }}
                              autoFocus
                              className="w-full rounded-md border border-white/15 bg-[#16161A] px-2 py-1 text-xs sm:text-[13px] font-medium text-white placeholder:text-white/40 focus:border-[#DE0500] focus:outline-none"
                              placeholder="Rename chat"
                            />
                            {formatTime(chat.lastMessageAt) && (
                              <span className="text-[11px] text-white/40">
                                {formatTime(chat.lastMessageAt)}
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="flex-1 truncate text-left"
                            onClick={() => onSelectChat(chat._id)}
                          >
                            <p
                              className={`truncate text-xs sm:text-[13px] font-medium ${
                                currentChatId === chat._id
                                  ? "text-white"
                                  : "text-white/85"
                              }`}
                            >
                              {chat.title || "Untitled chat"}
                            </p>
                            {formatTime(chat.lastMessageAt) && (
                              <span className="text-[10px] sm:text-[11px] text-white/40">
                                {formatTime(chat.lastMessageAt)}
                              </span>
                            )}
                          </button>
                        )}
                      </div>

                      {editingChatId === chat._id ? (
                        <div className="flex items-center gap-1 pl-2">
                          <button
                            type="button"
                            onClick={() => void handleSaveRename(chat._id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-green-400 transition-colors duration-200 hover:bg-green-500/10"
                            aria-label="Save title"
                          >
                            <FiCheck className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChatId(null);
                              setDraftTitle("");
                            }}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-white/60 transition-colors duration-200 hover:bg-white/10"
                            aria-label="Cancel editing"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 pl-2">
                          {onRenameChat && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingChatId(chat._id);
                                setDraftTitle(chat.title ?? "");
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded-md text-white/50 opacity-0 transition-all duration-200 hover:text-white group-hover:opacity-100"
                              aria-label="Rename chat"
                            >
                              <FiEdit2 className="text-sm" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onDeleteChat(chat._id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-white/50 opacity-0 transition-all duration-200 hover:text-red-400 group-hover:opacity-100"
                            aria-label="Delete chat"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default ChatHistoryPanel;
