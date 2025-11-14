import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import ChatMessageBubble from "../ai-chat/ChatMessage";
import TypingIndicator from "../ai-chat/TypingIndicator";
import { aiContentService } from "../../services/ai-chat/ai-content";
import type {
  Chat,
  ChatMessage as ChatMessageType,
} from "../../types/ai-content";
import ChatbotHistoryPanel from "./ChatHistoryPanel";

const QUICK_PROMPTS = [
  "Write a story",
  "Teach me React",
  "Explain quantum computing",
  "Plan weekly meals",
];

const MIN_EDGE_OFFSET = 16;

const getMessageKey = (message: ChatMessageType) =>
  `${message.role}-${message.timestamp ?? ""}-${message.content}`;

interface ChatbotProps {
  userProfilePicture?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ userProfilePicture }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: MIN_EDGE_OFFSET,
    y: MIN_EDGE_OFFSET,
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pointerOffsetRef = useRef({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const positionRef = useRef(position);
  const animationFrameRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [layoutOffsets, setLayoutOffsets] = useState({ top: 0, bottom: 0 });

  const applyButtonPosition = useCallback((x: number, y: number) => {
    positionRef.current = { x, y };
    if (buttonRef.current) {
      buttonRef.current.style.setProperty("--tw-translate-x", `${x}px`);
      buttonRef.current.style.setProperty("--tw-translate-y", `${y}px`);
    }
  }, []);

  useEffect(() => {
    applyButtonPosition(position.x, position.y);
  }, [applyButtonPosition, position.x, position.y]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateLayoutOffsets = useCallback(() => {
    if (!isOpen) {
      setLayoutOffsets({ top: 0, bottom: 0 });
      return;
    }

    const headerHeight = headerRef.current?.offsetHeight ?? 0;
    const footerHeight = footerRef.current?.offsetHeight ?? 0;

    setLayoutOffsets((prev) => {
      if (prev.top === headerHeight && prev.bottom === footerHeight) {
        return prev;
      }
      return { top: headerHeight, bottom: footerHeight };
    });
  }, [isOpen]);

  const buttonSize = useMemo(() => {
    if (!isMounted || !buttonRef.current) {
      return { width: 72, height: 72 };
    }
    const rect = buttonRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const updatePositionToBottomRight = () => {
      const { width, height } = buttonSize;
      setPosition({
        x: Math.max(
          MIN_EDGE_OFFSET,
          window.innerWidth - width - MIN_EDGE_OFFSET
        ),
        y: Math.max(
          MIN_EDGE_OFFSET,
          window.innerHeight - height - MIN_EDGE_OFFSET
        ),
      });
    };

    updatePositionToBottomRight();
    window.addEventListener("resize", updatePositionToBottomRight);

    return () =>
      window.removeEventListener("resize", updatePositionToBottomRight);
  }, [buttonSize, isMounted]);

  useEffect(() => {
    if (!isDragging || !isMounted) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) {
        return;
      }

      const nextX = event.clientX - pointerOffsetRef.current.x;
      const nextY = event.clientY - pointerOffsetRef.current.y;

      const { width, height } = buttonSize;
      const maxX = window.innerWidth - width - MIN_EDGE_OFFSET;
      const maxY = window.innerHeight - height - MIN_EDGE_OFFSET;

      const clampedX = Math.min(Math.max(MIN_EDGE_OFFSET, nextX), maxX);
      const clampedY = Math.min(Math.max(MIN_EDGE_OFFSET, nextY), maxY);

      if (!movedRef.current) {
        const deltaX = Math.abs(event.clientX - startPointerRef.current.x);
        const deltaY = Math.abs(event.clientY - startPointerRef.current.y);
        if (deltaX > 3 || deltaY > 3) {
          movedRef.current = true;
        }
      }

      applyButtonPosition(clampedX, clampedY);

      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          animationFrameRef.current = null;
          setPosition(positionRef.current);
        });
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerIdRef.current) {
        return;
      }

      pointerIdRef.current = null;
      setIsDragging(false);

      if (!movedRef.current) {
        setIsOpen(true);
      }

      if (buttonRef.current) {
        buttonRef.current.style.transition = "";
        try {
          buttonRef.current.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* no-op */
        }
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      setPosition(positionRef.current);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [applyButtonPosition, buttonSize, isDragging, isMounted]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    updateLayoutOffsets();
  }, [historyOpen, isGenerating, isOpen, messages.length, updateLayoutOffsets]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => {
      updateLayoutOffsets();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, updateLayoutOffsets]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMounted) {
      return;
    }

    event.preventDefault();
    buttonRef.current?.setPointerCapture(event.pointerId);
    if (buttonRef.current) {
      buttonRef.current.style.transition = "none";
    }
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pointerIdRef.current = event.pointerId;
    startPointerRef.current = { x: event.clientX, y: event.clientY };
    movedRef.current = false;

    const rect = buttonRef.current?.getBoundingClientRect();
    pointerOffsetRef.current = {
      x: event.clientX - (rect?.left ?? positionRef.current.x),
      y: event.clientY - (rect?.top ?? positionRef.current.y),
    };

    setIsDragging(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const loadChats = useCallback(async () => {
    try {
      const response = await aiContentService.getUserChats();
      if (response.success && response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error("Failed to load chats in chatbot:", error);
    }
  }, []);

  const loadChatHistory = useCallback(async (selectedChatId: string) => {
    setIsHistoryLoading(true);
    setError(null);
    try {
      const response = await aiContentService.getChatHistory(selectedChatId);
      if (response.success && response.data) {
        setChatId(selectedChatId);
        setMessages(response.data.messages ?? []);
      } else {
        setChatId(null);
        setMessages([]);
        setError(response.message ?? "Failed to load chat history.");
      }
    } catch (error) {
      console.error("Failed to load chat history in chatbot:", error);
      setChatId(null);
      setMessages([]);
      setError("Failed to load chat history.");
    } finally {
      setIsHistoryLoading(false);
      setHistoryOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadChats();
    }
  }, [isOpen, loadChats]);

  useEffect(() => {
    if (historyOpen) {
      void loadChats();
    }
  }, [historyOpen, loadChats]);

  const sendMessage = async (content: string): Promise<boolean> => {
    const trimmed = content.trim();

    if (!trimmed || isGenerating) {
      return false;
    }

    setError(null);

    const userMessage: ChatMessageType = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await aiContentService.generateChatMessage({
        message: trimmed,
        chatId: chatId ?? undefined,
      });

      if (response.success && response.data) {
        setChatId(response.data.chatId);

        const incomingMessages = response.data.messages ?? [];
        if (incomingMessages.length > 0) {
          setMessages((prev) => {
            if (prev.length === 0 || incomingMessages.length > prev.length) {
              return incomingMessages;
            }

            const existingKeys = new Set(prev.map(getMessageKey));
            const merged = [...prev];

            incomingMessages.forEach((incomingMessage) => {
              const key = getMessageKey(incomingMessage);
              if (!existingKeys.has(key)) {
                merged.push(incomingMessage);
                existingKeys.add(key);
              }
            });

            return merged;
          });
        }
        await loadChats();
        return true;
      }

      setError(response.message ?? "Failed to generate a response.");
      return false;
    } catch (error) {
      console.error("Chatbot message send failed:", error);
      setError("Unable to reach the assistant. Please try again.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      return;
    }

    setInputValue("");
    const success = await sendMessage(trimmed);

    if (!success) {
      setInputValue(trimmed);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    void (async () => {
      const success = await sendMessage(prompt);

      if (!success) {
        setInputValue(prompt);
      }
    })();
  };

  const handleSelectChat = async (selectedChatId: string) => {
    if (selectedChatId === chatId) {
      setHistoryOpen(false);
      return;
    }

    await loadChatHistory(selectedChatId);
    await loadChats();
  };

  const handleDeleteChat = async (targetChatId: string) => {
    const confirmed = window.confirm(
      "Delete this chat? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await aiContentService.deleteChat(targetChatId);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== targetChatId));
        if (chatId === targetChatId) {
          handleStartNewChat();
        }
        setError(null);
        await loadChats();
      } else {
        setError(response.message ?? "Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat in chatbot:", error);
      setError("Failed to delete chat");
    }
  };

  const handleRenameChat = async (targetChatId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      return false;
    }

    try {
      const response = await aiContentService.updateChatTitle(targetChatId, {
        title: trimmedTitle,
      });

      if (response.success && response.data) {
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === targetChatId
              ? { ...chat, title: response.data!.title }
              : chat
          )
        );
        await loadChats();
        return true;
      }

      setError(response.message ?? "Unable to rename chat");
      return false;
    } catch (error) {
      console.error("Failed to rename chat in chatbot:", error);
      setError("Unable to rename chat");
      return false;
    }
  };

  const handleStartNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInputValue("");
    setError(null);
    setHistoryOpen(false);
    void loadChats();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, isGenerating, messages]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 z-[120] flex justify-center sm:inset-auto sm:bottom-8 sm:right-6 sm:left-auto sm:justify-end">
          <div
            className={`w-full transition-[width] duration-300 ease-in-out ${
              historyOpen ? "sm:w-[706px]" : "sm:w-[446px]"
            }`}
          >
            <div className="relative flex h-full max-h-[90vh] w-full flex-row overflow-hidden rounded-md bg-[#121214] text-white shadow-[0_32px_80px_rgba(0,0,0,0.65)] sm:h-[694px] sm:max-h-none">
              <ChatbotHistoryPanel
                chats={chats}
                currentChatId={chatId}
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                onNewChat={handleStartNewChat}
                onSelectChat={(selectedId) => void handleSelectChat(selectedId)}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
              />
              <div className="relative flex h-full flex-1 flex-col overflow-hidden">
                <header
                  ref={headerRef}
                  className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[#121214] px-6 pt-6 pb-4"
                >
                  <button
                    type="button"
                    onClick={() => setHistoryOpen((prev) => !prev)}
                    className="inline-flex min-h-[32px] w-auto items-center justify-center gap-0.5 rounded-md bg-[linear-gradient(180deg,_#FF5C5C_0%,_#DC0000_100%)] px-2.5 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <MdKeyboardArrowLeft className="text-lg" />
                    Chats
                  </button>
                  <div className="flex items-center gap-6 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={handleStartNewChat}
                      className="flex items-center gap-2 text-white/85 transition-colors duration-200 hover:text-white"
                    >
                      <FiPlus className="text-lg" />
                      New chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/7 text-white/75 transition-all duration-200 hover:bg-white/12 hover:text-white"
                    >
                      <FiX className="text-lg" />
                      <span className="sr-only">Close chatbot</span>
                    </button>
                  </div>
                </header>

                <main
                  className="relative flex flex-1 flex-col overflow-hidden break-words"
                  style={{
                    paddingTop: layoutOffsets.top,
                    paddingBottom: layoutOffsets.bottom,
                  }}
                >
                  <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 sm:px-6 custom-scrollbar hide-scrollbar">
                    <div className="flex w-full flex-col gap-4 overflow-x-hidden pb-10 pr-1">
                      {isHistoryLoading ? (
                        <div className="flex justify-center py-6 text-sm text-white/50">
                          Loading conversation...
                        </div>
                      ) : messages.length === 0 && !isGenerating ? (
                        <div className="mt-6 flex flex-col items-center text-center text-white/45">
                          <p className="text-sm sm:text-base">
                            Ask anything to get started.
                          </p>
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

                  {messages.length === 0 &&
                    !isGenerating &&
                    !isHistoryLoading && (
                      <div className="space-y-4 overflow-x-hidden px-4 pb-3 sm:px-6">
                        <div className="px-1 sm:px-2">
                          <h2 className="text-[22px] font-semibold leading-[30px] text-white sm:text-[24px] sm:leading-[34px]">
                            How can I help you?
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {QUICK_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => handleQuickPrompt(prompt)}
                              disabled={isGenerating}
                              className="rounded-full bg-[#1C1D21] px-4 py-3 text-[11px] font-medium text-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </main>

                <footer
                  ref={footerRef}
                  className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#121214] px-3 py-3 sm:px-6 sm:py-4"
                >
                  <div className="flex w-full items-center gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => void handleSubmit()}
                      disabled={isGenerating || !inputValue.trim()}
                      className="flex h-12 w-12 items-center justify-center text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <IoSend className="text-xl" />
                      <span className="sr-only">Send message</span>
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        className={`fixed left-0 top-0 z-[130] flex h-14 w-14 select-none items-center justify-center rounded-full bg-[#1C1D21] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/20 cursor-grab active:cursor-grabbing transform-gpu ${
          isOpen ? "pointer-events-none scale-90 opacity-0" : "active:scale-95"
        }`}
      >
        <img
          src="/svg/ninja-spinner.svg"
          alt="Ninja Assistant"
          className="h-6 w-6"
        />
        <span className="sr-only">Open chatbot</span>
      </button>
    </>
  );
};

export default Chatbot;
