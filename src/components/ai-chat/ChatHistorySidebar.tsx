import { useEffect, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiPlus, FiCheck, FiSearch } from "react-icons/fi";
import { PiBrainLight } from "react-icons/pi";
import {} from "react-icons/fa";
import { FaHistory, FaTrash, FaEdit } from "react-icons/fa";
import { Chat } from "../../types/ai-content";

interface ChatHistorySidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  onSearch?: (query: string) => Promise<Chat[]> | Chat[];
}

const buildSnippet = (chat: Chat, query: string): string | null => {
  if (!chat.messages || chat.messages.length === 0) return null;
  const q = query.trim().toLowerCase();
  if (!q) return null;

  for (const message of chat.messages) {
    const content = message.content || "";
    const idx = content.toLowerCase().indexOf(q);
    if (idx !== -1) {
      const start = Math.max(0, idx - 30);
      const end = Math.min(content.length, idx + q.length + 60);
      const snippet = content.slice(start, end).trim();
      return `${start > 0 ? "…" : ""}${snippet}${
        end < content.length ? "…" : ""
      }`;
    }
  }
  return null;
};

const ChatHistorySidebar: FC<ChatHistorySidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  isOpen = true,
  onToggle,
  onSearch,
}) => {
  const [deleteHoverId, setDeleteHoverId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Chat[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!onSearch) return;
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await onSearch(trimmed);
        setSearchResults(results);
      } catch (err) {
        console.error("Chat search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const displayedChats = useMemo(() => {
    return searchResults !== null ? searchResults : chats;
  }, [searchResults, chats]);

  const isShowingSearchResults = searchResults !== null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleStartEdit = (chat: Chat) => {
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleSaveEdit = (chatId: string) => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && onRenameChat) {
      onRenameChat(chatId, trimmedTitle);
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    chatId: string
  ) => {
    if (e.key === "Enter") {
      handleSaveEdit(chatId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          flex-shrink-0 w-full sm:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0A0A0A] sm:bg-[#0A0A0A]/95 backdrop-blur-xl
          transition-all duration-300 ease-in-out transform
          ${
            isOpen
              ? "translate-x-0 opacity-100 pointer-events-auto lg:mr-0"
              : "translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-0 lg:pointer-events-none lg:-mr-80"
          }
          fixed lg:relative inset-y-0 right-0 top-0 lg:top-0 z-[70] lg:z-20
          flex flex-col
        `}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaHistory className="h-4 w-4 text-white/60" />
              <h2 className="text-sm font-semibold text-white/90">
                Chat History
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate("/ai-tools/chat/memories")}
                className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                title="Manage saved memories"
                aria-label="Manage saved memories"
              >
                <PiBrainLight className="h-4 w-4" />
              </button>
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                  aria-label="Close chat history"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#DE0500]/10 hover:bg-[#DE0500]/20 border border-[#DE0500]/30 text-[#DE0500] hover:text-white transition-colors text-sm font-medium"
            >
              <FiPlus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="sticky top-0 z-10 p-4 border-b border-white/10 bg-[#0A0A0A]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-8 pr-8 py-2 text-sm bg-[#1A1A1A] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#DE0500]/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    aria-label="Clear search"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto chat-history-scrollbar pr-2">
            {isShowingSearchResults && isSearching ? (
              <div className="p-4 text-center">
                <p className="text-sm text-white/40">Searching…</p>
              </div>
            ) : displayedChats.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-white/40">
                  {isShowingSearchResults
                    ? "No matching conversations"
                    : "No chat history yet"}
                </p>
                <p className="text-xs text-white/30 mt-1">
                  {isShowingSearchResults
                    ? "Try a different search term"
                    : "Start a new conversation to begin"}
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {displayedChats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`
                      group relative flex items-start justify-between px-3 py-2.5 rounded-lg cursor-pointer
                      transition-all duration-200
                      ${
                        currentChatId === chat._id
                          ? "bg-[#DE0500]/10 border border-[#DE0500]/30"
                          : "hover:bg-white/5 border border-transparent"
                      }
                    `}
                    onClick={() => onSelectChat(chat._id)}
                    onMouseEnter={() => setDeleteHoverId(chat._id)}
                    onMouseLeave={() => setDeleteHoverId(null)}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      {editingChatId === chat._id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, chat._id)}
                          onBlur={() => handleSaveEdit(chat._id)}
                          autoFocus
                          className="w-full text-sm bg-[#1A1A1A] border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:border-[#DE0500]"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <>
                          <p
                            className={`text-sm truncate ${
                              currentChatId === chat._id
                                ? "text-white font-medium"
                                : "text-white/80"
                            }`}
                          >
                            {chat.title}
                          </p>
                          {chat.lastMessageAt && (
                            <p className="text-xs text-white/40 mt-0.5">
                              {formatDate(chat.lastMessageAt)}
                            </p>
                          )}
                          {isShowingSearchResults &&
                            (() => {
                              const snippet = buildSnippet(chat, searchQuery);
                              return snippet ? (
                                <p className="text-xs text-white/50 mt-1 line-clamp-2 italic">
                                  &ldquo;{snippet}&rdquo;
                                </p>
                              ) : null;
                            })()}
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {editingChatId === chat._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveEdit(chat._id);
                            }}
                            className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-green-400 hover:bg-green-500/10 transition-colors"
                            aria-label="Save"
                          >
                            <FiCheck className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEdit();
                            }}
                            className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors"
                            aria-label="Cancel"
                          >
                            <FiX className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          {onRenameChat && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(chat);
                              }}
                              className={`
                                flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center
                                transition-all duration-200
                                ${
                                  deleteHoverId === chat._id ||
                                  currentChatId === chat._id
                                    ? "opacity-100 text-white/60 hover:text-blue-400 hover:bg-blue-500/10"
                                    : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100 text-white/40"
                                }
                              `}
                              aria-label={`Rename ${chat.title}`}
                            >
                              <FaEdit className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat._id);
                            }}
                            className={`
                              flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center
                              transition-all duration-200
                              ${
                                deleteHoverId === chat._id ||
                                currentChatId === chat._id
                                  ? "opacity-100 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                                  : "opacity-0 lg:opacity-0 lg:group-hover:opacity-100 text-white/40"
                              }
                            `}
                            aria-label={`Delete ${chat.title}`}
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay - Shows on mobile and when sidebar is open */}
      {isOpen && onToggle && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default ChatHistorySidebar;
