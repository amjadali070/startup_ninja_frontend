import { useCallback, useEffect, useState, useRef, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEdit3, FiX } from "react-icons/fi";
import { ImFileText } from "react-icons/im";
import { PiBrainLight } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import AIChatComposer from "../../components/ai-chat/AIChatComposer.tsx";
import AIChatQuickActionCard from "../../components/ai-chat/AIChatQuickActionCard.tsx";
import AIChatFooterNotice from "../../components/ai-chat/AIChatFooterNotice.tsx";
import ChatMessagesList from "../../components/ai-chat/ChatMessagesList.tsx";
import ChatHistorySidebar from "../../components/ai-chat/ChatHistorySidebar.tsx";
import DeleteChatModal from "../../components/ai-chat/DeleteChatModal.tsx";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useDraftPersistence } from "../../hooks/useDraftPersistence.ts";
import { authService } from "../../services/auth.ts";
import { aiContentService } from "../../services/ai-chat/ai-content.ts";
import { memoryService } from "../../services/ai-chat/memory.ts";
import { userService, type UserProfile } from "../../services/user.ts";
import { resolveProfilePictureUrl } from "../../utils/profile.ts";
import { ChatMessage, Chat } from "../../types/ai-content";

const quickActions = [
  {
    title: "Summarize Text",
    description: "Turn long articles into easy summaries.",
    icon: <ImFileText className="h-6 w-6" />,
    prompt:
      "Summarize the following text into bullet points highlighting key takeaways and action items:\n\n[Paste your text here]",
  },
  {
    title: "Creative Writing",
    description:
      "Generate stories, blog posts, or fresh content ideas in seconds.",
    icon: <FiEdit3 className="h-6 w-6" />,
    prompt:
      "Write a creative short story about a tenacious startup founder who overcomes an unexpected challenge using AI. Focus on emotion and vivid details.",
  },
  {
    title: "Answer Questions",
    description:
      "Ask me anything—from facts to advice—and get instant answers.",
    icon: <PiBrainLight className="h-6 w-6" />,
    prompt:
      "Answer the question: How can early-stage startups validate their product idea quickly with limited resources?",
  },
];

const AIChat: FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, user } = useAuth();
  const [prompt, setPrompt, clearPromptDraft] = useDraftPersistence(
    `chat-prompt:${user?.id || "guest"}`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    searchParams.get("chatId")
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default collapsed
  const typingIntervalRef = useRef<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    originalContent: string;
  } | null>(null);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const stopRequestedRef = useRef(false);
  const pendingFullTextRef = useRef<string>("");

  // Get user profile picture
  const userProfilePicture = userProfile?.profilePicture
    ? resolveProfilePictureUrl(userProfile.profilePicture)
    : null;

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    // Load user profile
    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.user) {
          setUserProfile(response.user);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();

    // Load user chats on mount and restore chat from URL if exists
    loadUserChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Cleanup typing animation on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        cancelAnimationFrame(typingIntervalRef.current);
      }
    };
  }, []);

  // Handle prompt from URL parameter (from Ninja Assistant)
  useEffect(() => {
    const promptFromUrl = searchParams.get("prompt");
    if (
      promptFromUrl &&
      !currentChatId &&
      messages.length === 0 &&
      !isGenerating &&
      !prompt
    ) {
      // Set the prompt from URL (pre-fill input field)
      setPrompt(promptFromUrl);
      // Remove prompt from URL to avoid re-triggering
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("prompt");
      setSearchParams(newParams);
    }
  }, [
    searchParams,
    currentChatId,
    messages.length,
    isGenerating,
    prompt,
    setSearchParams,
  ]);

  const loadUserChats = useCallback(
    async (shouldRestoreFromUrl = true) => {
      try {
        const response = await aiContentService.getUserChats();
        if (response.success && response.data) {
          setChats(response.data);

          // After chats are loaded, check if we need to restore chat from URL
          if (shouldRestoreFromUrl && isInitialLoad) {
            const chatIdFromUrl = searchParams.get("chatId");
            if (chatIdFromUrl) {
              // Verify chat exists in the loaded chats
              const chatExists = response.data.some(
                (chat) => chat._id === chatIdFromUrl
              );
              if (chatExists) {
                // Load the chat history
                try {
                  const historyResponse = await aiContentService.getChatHistory(
                    chatIdFromUrl
                  );
                  if (historyResponse.success && historyResponse.data) {
                    setMessages(historyResponse.data.messages || []);
                    setCurrentChatId(chatIdFromUrl);
                    setSearchParams({ chatId: chatIdFromUrl });
                    setError(null);
                  } else {
                    // Chat history failed to load, reset
                    setSearchParams({});
                    setCurrentChatId(null);
                    setMessages([]);
                  }
                } catch (historyErr) {
                  console.error("Failed to load chat history:", historyErr);
                  setSearchParams({});
                  setCurrentChatId(null);
                  setMessages([]);
                }
              } else {
                // Chat doesn't exist, reset
                setSearchParams({});
                setCurrentChatId(null);
                setMessages([]);
              }
            }
            setIsInitialLoad(false);
          }

          return response.data;
        }
        return [];
      } catch (err) {
        console.error("Failed to load chats:", err);
        if (shouldRestoreFromUrl && isInitialLoad) {
          setIsInitialLoad(false);
        }
        return [];
      }
    },
    [isInitialLoad, searchParams, setSearchParams]
  );

  const loadChatHistory = useCallback(
    async (chatId: string) => {
      try {
        const response = await aiContentService.getChatHistory(chatId);
        if (response.success && response.data) {
          setMessages(response.data.messages || []);
          setCurrentChatId(chatId);
          // Update URL with chatId
          setSearchParams({ chatId });
          setError(null);
          // Close sidebar on mobile after selecting
          setSidebarOpen(false);
        } else {
          setError(response.message || "Failed to load chat history");
          // If chat not found, remove from URL and reset
          setSearchParams({});
          setCurrentChatId(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setError("Failed to load chat history");
        // On error, remove from URL and reset
        setSearchParams({});
        setCurrentChatId(null);
        setMessages([]);
      }
    },
    [setSearchParams]
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("AI Chat logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const typeWriterAppend = useCallback((fullText: string) => {
    if (typingIntervalRef.current) {
      cancelAnimationFrame(typingIntervalRef.current);
    }

    setIsRevealing(true);

    let currentIndex = 0;
    const totalLength = fullText.length;
    let lastTime = performance.now();
    const charsPerSecond = 2500;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const increment = (charsPerSecond * deltaTime) / 1000;
      currentIndex += increment;

      const sliceIndex = Math.min(Math.floor(currentIndex), totalLength);

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!last || last.role !== "assistant") return prev;

        if (last.content.length === sliceIndex) return prev;

        const slice = fullText.slice(0, sliceIndex);
        next[next.length - 1] = { ...last, content: slice };
        return next;
      });

      if (sliceIndex < totalLength) {
        typingIntervalRef.current = requestAnimationFrame(animate);
      } else {
        typingIntervalRef.current = null;
        setIsRevealing(false);
      }
    };

    typingIntervalRef.current = requestAnimationFrame(animate);
  }, []);

  // Reveals assistant text via the client-side typewriter animation, unless
  // the user already hit Stop while the response was still in flight — in
  // that case skip straight to showing the full text (no real network
  // streaming exists to actually cancel, see plan.md's Phase 2 scoping note).
  const revealAssistantText = useCallback(
    (fullText: string) => {
      pendingFullTextRef.current = fullText;
      if (stopRequestedRef.current) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last || last.role !== "assistant") return prev;
          next[next.length - 1] = { ...last, content: fullText };
          return next;
        });
        return;
      }
      typeWriterAppend(fullText);
    },
    [typeWriterAppend]
  );

  const handleStopGenerating = useCallback(() => {
    stopRequestedRef.current = true;
    if (typingIntervalRef.current) {
      cancelAnimationFrame(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (pendingFullTextRef.current) {
      const fullText = pendingFullTextRef.current;
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!last || last.role !== "assistant") return prev;
        next[next.length - 1] = { ...last, content: fullText };
        return next;
      });
    }
    setIsRevealing(false);
    setIsGenerating(false);
  }, []);

  // Core "send a message" flow, parameterized so both the composer (reading
  // from `prompt`/`selectedFiles` state) and follow-up chip clicks (passing
  // explicit text, bypassing state to avoid a stale-closure race) can share it.
  const submitUserMessage = useCallback(
    async (text: string, files: File[]) => {
      if (!text && files.length === 0) {
        return false;
      }

      stopRequestedRef.current = false;
      setIsGenerating(true);
      setError(null);
      setFollowUps([]);

      const userMessage: ChatMessage = {
        role: "user",
        content: text,
        attachments: files.map((f) => ({ filename: f.name, fileType: f.type })),
      };

      setMessages((prev) => [...prev, userMessage]);

      if (files.length > 0) {
        setUploadProgress(0);
      }

      try {
        const response = await aiContentService.generateChatMessage({
          message: text,
          chatId: currentChatId || undefined,
          files: files.length ? files : undefined,
          enableSearch,
          onUploadProgress: files.length > 0 ? setUploadProgress : undefined,
        });

        if (response.success && response.data) {
          if (!currentChatId && response.data.chatId) {
            setCurrentChatId(response.data.chatId);
            setSearchParams({ chatId: response.data.chatId });
          }

          const serverMessages = response.data.messages || [];

          const assistantMessages = serverMessages.filter(
            (m) => m.role === "assistant"
          );
          const lastAssistantMessage =
            assistantMessages[assistantMessages.length - 1];
          const finalText = lastAssistantMessage?.content || "";

          if (finalText) {
            const newUserMessage = serverMessages.find((m) => m.role === "user");

            setMessages((prevMessages) => {
              const withoutEmptyAssistant = prevMessages.filter(
                (msg) => !(msg.role === "assistant" && !msg.content)
              );

              const lastMessage =
                withoutEmptyAssistant[withoutEmptyAssistant.length - 1];
              const isLastMessageOurUserMessage =
                lastMessage &&
                lastMessage.role === "user" &&
                lastMessage.content === text;

              // Carry sources/_id/timestamp onto the placeholder up front so
              // citations render immediately instead of waiting for the
              // typewriter reveal to finish (it only ever animates .content).
              const placeholder: ChatMessage = {
                ...lastAssistantMessage,
                content: "",
              };

              if (isLastMessageOurUserMessage) {
                // Swap the optimistic local message for the server's version
                // — it carries the real _id the Edit button needs, plus
                // server-confirmed attachment metadata.
                const withServerUserMessage = [...withoutEmptyAssistant];
                if (newUserMessage) {
                  withServerUserMessage[withServerUserMessage.length - 1] =
                    newUserMessage;
                }
                return [...withServerUserMessage, placeholder];
              }

              let messagesToReturn = [...withoutEmptyAssistant];
              if (newUserMessage && !isLastMessageOurUserMessage) {
                messagesToReturn.push(newUserMessage);
              }

              messagesToReturn.push(placeholder);

              return messagesToReturn;
            });

            setFollowUps(response.data.followUps || []);

            setTimeout(() => {
              revealAssistantText(finalText);
            }, 30);
          } else {
            setMessages((prevMessages) => {
              const newUserMessage = serverMessages.find(
                (m) => m.role === "user"
              );
              if (newUserMessage) {
                const hasUserMessage = prevMessages.some(
                  (msg) =>
                    msg.role === "user" &&
                    msg.content === newUserMessage.content &&
                    prevMessages.indexOf(msg) ===
                      prevMessages.length -
                        1 -
                        prevMessages
                          .slice()
                          .reverse()
                          .findIndex((m) => m.role === "user")
                );

                if (!hasUserMessage) {
                  return [...prevMessages, newUserMessage];
                }
              }
              return prevMessages;
            });
            setError("No response received from assistant");
          }

          await loadUserChats(false);

          return true;
        } else {
          setError(response.message || "Failed to generate response");
          setMessages((prev) =>
            prev.filter((msg, index) => {
              return !(
                msg.role === "user" &&
                msg.content === text &&
                index === prev.length - 1
              );
            })
          );
          return false;
        }
      } catch (submissionError) {
        console.error("AI chat prompt submission failed:", submissionError);
        setError("Failed to send message. Please try again.");
        setMessages((prev) =>
          prev.filter((msg, index) => {
            return !(
              msg.role === "user" &&
              msg.content === text &&
              index === prev.length - 1
            );
          })
        );
        return false;
      } finally {
        setIsGenerating(false);
        setUploadProgress(null);
      }
    },
    [currentChatId, enableSearch, loadUserChats, revealAssistantText, setSearchParams]
  );

  const handleSubmitEdit = useCallback(
    async (newContent: string) => {
      const trimmed = newContent.trim();
      if (!currentChatId || !editingMessage || !trimmed) {
        setEditingMessage(null);
        return false;
      }

      stopRequestedRef.current = false;
      setError(null);
      setFollowUps([]);
      setIsGenerating(true);

      const editedId = editingMessage.id;
      setEditingMessage(null);

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m._id === editedId);
        return idx === -1 ? prev : prev.slice(0, idx);
      });

      try {
        const response = await aiContentService.editMessage(
          currentChatId,
          editedId,
          trimmed
        );

        if (response.success && response.data) {
          const serverMessages = response.data.messages || [];
          const userMsg = serverMessages.find((m) => m.role === "user");
          const assistantMsg = serverMessages.find((m) => m.role === "assistant");

          setMessages((prev) => [
            ...prev,
            ...(userMsg ? [userMsg] : []),
            ...(assistantMsg ? [{ ...assistantMsg, content: "" }] : []),
          ]);

          setFollowUps(response.data.followUps || []);

          if (assistantMsg?.content) {
            setTimeout(() => {
              revealAssistantText(assistantMsg.content);
            }, 30);
          }

          await loadUserChats(false);
          return true;
        } else {
          setError(response.message || "Failed to edit message");
          return false;
        }
      } catch (err) {
        console.error("Failed to edit message:", err);
        setError("Failed to edit message");
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    [currentChatId, editingMessage, loadUserChats, revealAssistantText]
  );

  const handleComposerSubmit = useCallback(async () => {
    const trimmedPrompt = prompt.trim();

    if (
      (!trimmedPrompt && selectedFiles.length === 0) ||
      isGenerating ||
      isRevealing
    ) {
      return false;
    }

    if (editingMessage) {
      setPrompt("");
      clearPromptDraft();
      setSelectedFiles([]);
      return handleSubmitEdit(trimmedPrompt);
    }

    const files = selectedFiles;
    setPrompt("");
    clearPromptDraft();
    setSelectedFiles([]);

    return submitUserMessage(trimmedPrompt, files);
  }, [
    prompt,
    selectedFiles,
    isGenerating,
    isRevealing,
    editingMessage,
    handleSubmitEdit,
    submitUserMessage,
    clearPromptDraft,
  ]);

  const handleRegenerate = useCallback(async () => {
    if (!currentChatId || isGenerating || isRevealing) return;

    // Regenerating the last response makes any pending edit-of-an-earlier
    // message stale — clear it so the "Editing message" banner and prefilled
    // composer don't linger and cause a confusing truncation on the next send.
    if (editingMessage) {
      setEditingMessage(null);
      setPrompt("");
      clearPromptDraft();
    }

    stopRequestedRef.current = false;
    setError(null);
    setFollowUps([]);
    setIsGenerating(true);

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === "assistant") {
        return [...prev.slice(0, -1), { role: "assistant", content: "" }];
      }
      return prev;
    });

    try {
      const response = await aiContentService.regenerateMessage(currentChatId);

      if (response.success && response.data?.message) {
        const newMessage = response.data.message;

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = { ...newMessage, content: "" };
          }
          return next;
        });

        setFollowUps(response.data.followUps || []);

        if (newMessage.content) {
          setTimeout(() => {
            revealAssistantText(newMessage.content);
          }, 30);
        } else {
          setError("No response received from assistant");
        }

        await loadUserChats(false);
      } else {
        setError(response.message || "Failed to regenerate response");
      }
    } catch (err) {
      console.error("Failed to regenerate response:", err);
      setError("Failed to regenerate response");
    } finally {
      setIsGenerating(false);
    }
  }, [
    currentChatId,
    isGenerating,
    isRevealing,
    editingMessage,
    clearPromptDraft,
    loadUserChats,
    revealAssistantText,
  ]);

  const handleEditMessage = useCallback(
    (messageId: string, currentContent: string) => {
      // editMessage has no file-upload support server-side — drop any
      // pending selection so it can't be silently discarded on submit.
      setSelectedFiles([]);
      setEditingMessage({ id: messageId, originalContent: currentContent });
      setPrompt(currentContent);
    },
    [setPrompt]
  );

  const handleCancelEditMessage = useCallback(() => {
    setEditingMessage(null);
    setPrompt("");
    clearPromptDraft();
  }, [clearPromptDraft]);

  const handleSaveMemory = useCallback(
    async (content: string) => {
      try {
        const response = await memoryService.createMemory(
          content,
          currentChatId || undefined
        );
        if (response.success) {
          toast.success("Saved to memory");
        } else {
          toast.error(response.message || "Failed to save memory");
        }
      } catch (err) {
        console.error("Failed to save memory:", err);
        toast.error("Failed to save memory");
      }
    },
    [currentChatId]
  );

  const handleFollowUpClick = useCallback(
    (followUpPrompt: string) => {
      if (isGenerating || isRevealing) return;
      // Sending a follow-up abandons any pending edit-of-an-earlier-message
      // — clear it so the stale "Editing message" banner/draft don't linger
      // and cause a confusing truncation on a later send.
      if (editingMessage) {
        setEditingMessage(null);
        setPrompt("");
        clearPromptDraft();
      }
      submitUserMessage(followUpPrompt.trim(), []);
    },
    [isGenerating, isRevealing, editingMessage, clearPromptDraft, submitUserMessage]
  );

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5));
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleToggleSearch = useCallback(() => {
    setEnableSearch((prev) => !prev);
  }, []);

  const handleSearchChats = useCallback(async (query: string) => {
    const response = await aiContentService.getUserChats(query);
    if (response.success && response.data) {
      return response.data;
    }
    return [];
  }, []);

  const handleQuickAction = useCallback((template: string) => {
    setPrompt(template);
  }, []);

  const handleNewChat = useCallback(() => {
    if (typingIntervalRef.current) {
      cancelAnimationFrame(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    stopRequestedRef.current = false;
    pendingFullTextRef.current = "";
    setIsRevealing(false);
    setCurrentChatId(null);
    setMessages([]);
    setPrompt("");
    setError(null);
    setSearchParams({});
    setSelectedFiles([]);
    setEditingMessage(null);
    setFollowUps([]);
    setEnableSearch(false);
  }, [setSearchParams]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      if (chatId !== currentChatId) {
        if (typingIntervalRef.current) {
          cancelAnimationFrame(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        setIsRevealing(false);
        setSelectedFiles([]);
        setEditingMessage(null);
        setFollowUps([]);
        loadChatHistory(chatId);
      }
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    [currentChatId, loadChatHistory]
  );

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) {
        setChatToDelete({ id: chatId, title: chat.title });
        setDeleteModalOpen(true);
      }
    },
    [chats]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!chatToDelete) return;

    setIsDeleting(true);
    try {
      const response = await aiContentService.deleteChat(chatToDelete.id);
      if (response.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatToDelete.id));

        toast.success("Chat deleted successfully");

        if (chatToDelete.id === currentChatId) {
          handleNewChat();
          setSearchParams({});
        }

        setDeleteModalOpen(false);
        setChatToDelete(null);
      } else {
        setError(response.message || "Failed to delete chat");
        toast.error(response.message || "Failed to delete chat");
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      setError("Failed to delete chat");
      toast.error("Failed to delete chat");
    } finally {
      setIsDeleting(false);
    }
  }, [chatToDelete, currentChatId, handleNewChat, setSearchParams]);

  const handleRenameChat = useCallback(
    async (chatId: string, newTitle: string) => {
      try {
        const response = await aiContentService.updateChatTitle(chatId, {
          title: newTitle,
        });
        if (response.success && response.data) {
          setChats((prev) =>
            prev.map((chat) =>
              chat._id === chatId
                ? { ...chat, title: response.data!.title }
                : chat
            )
          );
          toast.success("Chat title updated successfully");
        } else {
          toast.error(response.message || "Failed to update chat title");
        }
      } catch (err) {
        console.error("Failed to rename chat:", err);
        toast.error("Failed to update chat title");
      }
    },
    []
  );

  const handleExport = useCallback(async (format: "pdf" | "docx") => {
    if (!currentChatId) return;

    try {
      const toastId = toast.loading(`Generating ${format.toUpperCase()}...`);
      const response = await aiContentService.exportChat(currentChatId, format);
      
      if (response instanceof Blob) {
        toast.success(`Generated ${format.toUpperCase()}`, { id: toastId });
        
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        const currentChat = chats.find(c => c._id === currentChatId);
        const fileName = currentChat?.title ? `${currentChat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}` : `chat_export.${format}`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.error(response.message || `Failed to export ${format.toUpperCase()}`, { id: toastId });
      }
    } catch (err) {
      console.error(`Export failed:`, err);
      toast.error(`Failed to export document`);
    }
  }, [currentChatId, chats]);

  return (
    <DashboardLayout
      activePath="/ai-tools/chat"
      title="Ninja Assistant"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="h-full w-full flex flex-row overflow-hidden min-h-0 relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 right-4 z-30 lg:hidden h-10 w-10 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors shadow-lg"
            aria-label="Open chat history"
          >
            <FaHistory className="h-5 w-5" />
          </button>
        )}

        {/* Desktop Sidebar Toggle - Positioned differently */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex fixed top-24 right-4 z-30 h-10 w-10 rounded-lg bg-[#1A1A1A] border border-white/10 items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors shadow-lg"
            aria-label="Open chat history"
          >
            <FaHistory className="h-5 w-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 sm:px-6 md:px-10 xl:px-14">
          <ChatMessagesList
            messages={messages}
            isGenerating={isGenerating || isRevealing}
            userProfilePicture={userProfilePicture}
            error={error}
            followUps={followUps}
            onEditMessage={handleEditMessage}
            onRegenerate={handleRegenerate}
            onSaveMemory={handleSaveMemory}
            onFollowUpClick={handleFollowUpClick}
          />

          {editingMessage && (
            <div className="flex-shrink-0 mb-2 flex items-center justify-between gap-2 px-4 py-2 rounded-lg bg-[#DE0500]/5 border border-[#DE0500]/20 text-xs text-white/70">
              <span>Editing message — sending will regenerate the response from this point.</span>
              <button
                onClick={handleCancelEditMessage}
                className="text-white/50 hover:text-white flex-shrink-0"
                aria-label="Cancel editing"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex-shrink-0 w-full">
            <AIChatComposer
              prompt={prompt}
              onPromptChange={(value) => setPrompt(value)}
              onSubmit={handleComposerSubmit}
              onNewChat={handleNewChat}
              isGenerating={isGenerating || isRevealing}
              onExportPdf={currentChatId ? () => handleExport("pdf") : undefined}
              onExportDocx={currentChatId ? () => handleExport("docx") : undefined}
              className="w-full"
              selectedFiles={selectedFiles}
              onFilesSelected={editingMessage ? undefined : handleFilesSelected}
              onRemoveFile={handleRemoveFile}
              uploadProgress={uploadProgress}
              onStopGenerating={handleStopGenerating}
              enableSearch={enableSearch}
              onToggleSearch={handleToggleSearch}
              placeholder={
                editingMessage ? "Edit your message..." : "Ask me anything..."
              }
            />
          </div>

          {messages.length === 0 && !isGenerating && (
            <section className="flex-shrink-0 grid w-full gap-2 sm:gap-6 mt-4 grid-cols-3">
              {quickActions.map((action) => (
                <AIChatQuickActionCard
                  key={action.title}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  onClick={() => handleQuickAction(action.prompt)}
                />
              ))}
            </section>
          )}

          <div className="flex-shrink-0 pb-2">
            <AIChatFooterNotice />
          </div>
        </div>

        <ChatHistorySidebar
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onSearch={handleSearchChats}
        />

        <DeleteChatModal
          isOpen={deleteModalOpen}
          chatTitle={chatToDelete?.title || ""}
          onClose={() => {
            if (!isDeleting) {
              setDeleteModalOpen(false);
              setChatToDelete(null);
            }
          }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </main>
    </DashboardLayout>
  );
};

export default AIChat;
