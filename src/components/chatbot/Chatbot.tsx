import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { chatbotService } from "../../services/chatbot/chatbot";
import type {
  Chat,
  ChatMessage as ChatMessageType,
} from "../../types/ai-content";
import ChatbotHistoryPanel from "./ChatHistoryPanel";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotQuickPrompts from "./ChatbotQuickPrompts";
import ChatbotComposer from "./ChatbotComposer";
import ChatbotDeleteChatModal from "./DeleteChatModal";

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
  //   if (!isMounted) {
  //     return;
  //   }

  //   event.preventDefault();
  //   buttonRef.current?.setPointerCapture(event.pointerId);
  //   if (buttonRef.current) {
  //     buttonRef.current.style.transition = "none";
  //   }
  //   if (animationFrameRef.current !== null) {
  //     window.cancelAnimationFrame(animationFrameRef.current);
  //     animationFrameRef.current = null;
  //   }
  //   pointerIdRef.current = event.pointerId;
  //   startPointerRef.current = { x: event.clientX, y: event.clientY };
  //   movedRef.current = false;

  //   const rect = buttonRef.current?.getBoundingClientRect();
  //   pointerOffsetRef.current = {
  //     x: event.clientX - (rect?.left ?? positionRef.current.x),
  //     y: event.clientY - (rect?.top ?? positionRef.current.y),
  //   };

  //   setIsDragging(true);
  // };

  // const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
  //   if (event.key === "Enter" || event.key === " ") {
  //     event.preventDefault();
  //     setIsOpen(true);
  //   }
  // };

  const loadChats = useCallback(async () => {
    try {
      const response = await chatbotService.getUserChats();
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
      const response = await chatbotService.getChatHistory(selectedChatId);
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
      const response = await chatbotService.generateChatMessage({
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

  const handleDeleteChat = (targetChatId: string) => {
    const targetChat = chats.find((chat) => chat._id === targetChatId);
    if (!targetChat) {
      return;
    }
    setChatToDelete({
      id: targetChatId,
      title: targetChat.title ?? "Untitled chat",
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await chatbotService.deleteChat(chatToDelete.id);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatToDelete.id));
        if (chatId === chatToDelete.id) {
          handleStartNewChat();
        }
        setError(null);
        await loadChats();
        setDeleteModalOpen(false);
        setChatToDelete(null);
      } else {
        setError(response.message ?? "Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat in chatbot:", error);
      setError("Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRenameChat = async (targetChatId: string, newTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      return false;
    }

    try {
      const response = await chatbotService.updateChatTitle(targetChatId, {
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
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 md:bottom-6 lg:bottom-8 z-[120] flex justify-center sm:inset-auto sm:right-4 md:right-6 sm:left-auto sm:justify-end">
          <div
            className={`w-full transition-[width] duration-300 ease-in-out ${
              historyOpen ? "sm:w-[706px] md:w-[720px]" : "sm:w-[446px] md:w-[480px]"
            }`}
          >
            <div className="relative flex h-full max-h-[85vh] sm:max-h-[90vh] w-full flex-row overflow-hidden rounded-lg sm:rounded-md bg-[#121214] text-white shadow-[0_32px_80px_rgba(0,0,0,0.65)] sm:h-[600px] md:h-[650px] lg:h-[694px] sm:max-h-none">
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
                <ChatbotHeader
                  ref={headerRef}
                  onToggleHistory={() => setHistoryOpen((prev) => !prev)}
                  onStartNewChat={handleStartNewChat}
                  onClose={() => setIsOpen(false)}
                  historyOpen={historyOpen}
                />
                <main
                  className="relative flex flex-1 flex-col overflow-hidden break-words"
                  style={{
                    paddingTop: layoutOffsets.top,
                    paddingBottom: layoutOffsets.bottom,
                  }}
                >
                  <ChatbotMessages
                    messages={messages}
                    isHistoryLoading={isHistoryLoading}
                    isGenerating={isGenerating}
                    error={error}
                    userProfilePicture={userProfilePicture}
                    messagesEndRef={messagesEndRef}
                  />

                  {messages.length === 0 &&
                    !isGenerating &&
                    !isHistoryLoading && (
                      <ChatbotQuickPrompts
                        prompts={QUICK_PROMPTS}
                        disabled={isGenerating}
                        onSelect={handleQuickPrompt}
                      />
                    )}
                </main>

                <ChatbotComposer
                  ref={footerRef}
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  onInputKeyDown={handleInputKeyDown}
                  onSubmit={() => void handleSubmit()}
                  isGenerating={isGenerating}
                />

                <ChatbotDeleteChatModal
                  isOpen={deleteModalOpen}
                  chatTitle={chatToDelete?.title ?? ""}
                  onClose={() => {
                    if (!isDeleting) {
                      setDeleteModalOpen(false);
                      setChatToDelete(null);
                    }
                  }}
                  onConfirm={() => void handleConfirmDelete()}
                  isDeleting={isDeleting}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        className={`fixed left-0 top-0 z-[130] flex h-12 w-12 sm:h-14 sm:w-14 select-none items-center justify-center rounded-full bg-[#1C1D21] text-white shadow-[0_24px_60px_rgba(0,0,0,0.45)] outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/20 cursor-grab active:cursor-grabbing transform-gpu ${
          isOpen ? "pointer-events-none scale-90 opacity-0" : "active:scale-95"
        }`}
      >
        <img
          src="/svg/ninja-spinner.svg"
          alt="Ninja Assistant"
          className="h-5 w-5 sm:h-6 sm:w-6"
        />
        <span className="sr-only">Open chatbot</span>
      </button> */}
    </>
  );
};

export default Chatbot;
