import { useCallback, useEffect, useState, useRef, type FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
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
import { useAuth } from "../../hooks/useAuth.tsx";
import { authService } from "../../services/auth.ts";
import { aiContentService } from "../../services/ai-content.ts";
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
  const { logout } = useAuth();
  const [prompt, setPrompt] = useState("");
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

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

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
    let index = 0;

    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = window.setInterval(() => {
      index += 3; // type 3 chars per tick

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!last || last.role !== "assistant") return prev;
        const slice = fullText.slice(0, index);
        next[next.length - 1] = { ...last, content: slice };
        return next;
      });

      if (index >= fullText.length) {
        if (typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }
    }, 16);
  }, []);

  const handleComposerSubmit = useCallback(async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isGenerating) {
      return false;
    }

    setIsGenerating(true);
    setError(null);

    // Store the current message count to track what we've added
    const userMessage: ChatMessage = { role: "user", content: trimmedPrompt };

    // Add user message immediately for better UX
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await aiContentService.generateChatMessage({
        message: trimmedPrompt,
        chatId: currentChatId || undefined,
      });

      if (response.success && response.data) {
        // Update current chat ID if it's a new chat
        if (!currentChatId && response.data.chatId) {
          setCurrentChatId(response.data.chatId);
          // Update URL with new chatId
          setSearchParams({ chatId: response.data.chatId });
        }

        // Get all messages from server response
        const serverMessages = response.data.messages || [];

        // Find the last assistant message (the newly generated one)
        const assistantMessages = serverMessages.filter(
          (m) => m.role === "assistant"
        );
        const lastAssistantMessage =
          assistantMessages[assistantMessages.length - 1];
        const finalText = lastAssistantMessage?.content || "";

        if (finalText) {
          // Find the index of the last assistant message
          let lastAssistantIndex = -1;
          for (let i = serverMessages.length - 1; i >= 0; i--) {
            if (serverMessages[i].role === "assistant") {
              lastAssistantIndex = i;
              break;
            }
          }

          // Replace the entire messages array with server messages (excluding the last assistant)
          // Then add the assistant message with empty content for typewriter effect
          const messagesWithoutLastAssistant = serverMessages.filter(
            (m, index) => index !== lastAssistantIndex
          );

          // Set messages to server messages (without the last assistant response)
          // Then add empty assistant message for typewriter effect
          setMessages([
            ...messagesWithoutLastAssistant,
            { role: "assistant", content: "" },
          ]);

          // Start typewriter effect
          setTimeout(() => {
            typeWriterAppend(finalText);
          }, 50);
        } else {
          // If no content, use server messages as-is
          setMessages(serverMessages);
          setError("No response received from assistant");
        }

        // Reload chats to get updated list (don't restore from URL since we just created/updated)
        await loadUserChats(false);

        setPrompt("");
        return true;
      } else {
        setError(response.message || "Failed to generate response");
        // Remove the user message we just added on error
        setMessages((prev) =>
          prev.filter((msg, index) => {
            // Remove the last user message if it matches
            return !(
              msg.role === "user" &&
              msg.content === trimmedPrompt &&
              index === prev.length - 1
            );
          })
        );
        return false;
      }
    } catch (submissionError) {
      console.error("AI chat prompt submission failed:", submissionError);
      setError("Failed to send message. Please try again.");
      // Remove the user message we just added on error
      setMessages((prev) =>
        prev.filter((msg, index) => {
          // Remove the last user message if it matches
          return !(
            msg.role === "user" &&
            msg.content === trimmedPrompt &&
            index === prev.length - 1
          );
        })
      );
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, currentChatId, isGenerating, loadUserChats, typeWriterAppend]);

  const handleQuickAction = useCallback((template: string) => {
    setPrompt(template);
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentChatId(null);
    setMessages([]);
    setPrompt("");
    setError(null);
    // Remove chatId from URL
    setSearchParams({});
  }, [setSearchParams]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      if (chatId !== currentChatId) {
        loadChatHistory(chatId);
      }
      // Close sidebar on mobile after selecting
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    },
    [currentChatId, loadChatHistory]
  );

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      try {
        const response = await aiContentService.deleteChat(chatId);
        if (response.success) {
          // Remove from chats list
          setChats((prev) => prev.filter((chat) => chat._id !== chatId));

          // Show success toast
          toast.success("Chat deleted successfully");

          // If deleted chat was current, reset to new chat
          if (chatId === currentChatId) {
            handleNewChat();
            // Remove chatId from URL
            setSearchParams({});
          }
        } else {
          setError(response.message || "Failed to delete chat");
          toast.error(response.message || "Failed to delete chat");
        }
      } catch (err) {
        console.error("Failed to delete chat:", err);
        setError("Failed to delete chat");
        toast.error("Failed to delete chat");
      }
    },
    [currentChatId, handleNewChat, setSearchParams]
  );

  return (
    <DashboardLayout
      activePath="/ai-tools/chat"
      title="Ninja Chat"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="h-full w-full flex flex-row overflow-hidden min-h-0 relative">
        {/* History Toggle Button - Shows when sidebar is collapsed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 right-4 z-30 lg:top-24 lg:right-4 h-10 w-10 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-colors shadow-lg"
            aria-label="Open chat history"
          >
            <FaHistory className="h-5 w-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 sm:px-6 md:px-10 xl:px-14">
          <ChatMessagesList
            messages={messages}
            isGenerating={isGenerating}
            userProfilePicture={userProfilePicture}
            error={error}
          />

          {/* Chat Composer - Always visible at bottom */}
          <div className="flex-shrink-0 w-full">
            <AIChatComposer
              prompt={prompt}
              onPromptChange={(value) => setPrompt(value)}
              onSubmit={handleComposerSubmit}
              onNewChat={handleNewChat}
              isGenerating={isGenerating}
              className="w-full"
            />
          </div>

          {messages.length === 0 && !isGenerating && (
            <section className="flex-shrink-0 grid w-full gap-[24px] mt-4 md:grid-cols-2 lg:grid-cols-3">
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

          {/* Footer Notice */}
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
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </main>
    </DashboardLayout>
  );
};

export default AIChat;
