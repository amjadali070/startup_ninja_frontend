import { type FC, useState, useEffect, useRef } from "react";
import { FiSend, FiZap, FiMessageCircle, FiAlertCircle, FiUser,   } from "react-icons/fi";
import { RiRobot2Fill } from "react-icons/ri";

import { aiChatService, ChatMessage } from "../../services/ai-chat";
import { ContractDetails } from "../../services/ninja-legal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface NinjaStrategistProps {
  contractData?: ContractDetails;
  disabled?: boolean;
}

const NinjaStrategist: FC<NinjaStrategistProps> = ({
  contractData,
  disabled = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [suggestGeneration, setSuggestGeneration] = useState(false);
  const [partialMessage, setPartialMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isFirstLoadRef = useRef(true);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change or streaming updates (scroll only the chat container)
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Scroll only the messages container, not the page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, partialMessage, isStreaming]);

  // Auto-resize textarea based on content
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    
    // Auto-resize textarea
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 120) + "px";
    }
  };

  // Handle textarea Enter key (send on Ctrl+Enter or Cmd+Enter)
  const handleTextAreaKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fetch chat history when contract data changes
  useEffect(() => {
    if (!contractData?._id || disabled) {
      setMessages([]);
      setIsChatLoading(false);
      isFirstLoadRef.current = true;
      return;
    }

    const fetchChatHistory = async () => {
      setIsChatLoading(true);
      try {
        const response = await aiChatService.getChatHistory(contractData._id);
        if (response.success && response.data?.messages) {
          setMessages(response.data.messages);
          setSuggestGeneration(response.data.suggestGeneration || false);

          // If no messages, get initial greeting from AI based on contract
          if (response.data.messages.length === 0) {
            isFirstLoadRef.current = false;
            await getInitialGreeting(contractData);
          } else {
            isFirstLoadRef.current = false;
          }
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsChatLoading(false);
      }
    };

    fetchChatHistory();
  }, [contractData?._id, disabled]);

  const getInitialGreeting = async (contract: ContractDetails) => {
    setIsStreaming(true);
    setPartialMessage("");
    try {
      // Call aiChatService to get initial greeting without saving to database
      const response = await aiChatService.getInitialGreeting(contract._id);

      if (response.success && response.data?.greeting) {
        const fullResponse = response.data.greeting;

        // Show typing effect - token by token
        let displayText = "";
        const tokens = fullResponse.split(" ");

        for (let i = 0; i < tokens.length; i++) {
          displayText += tokens[i] + " ";
          setPartialMessage(displayText);
          // Add small delay between tokens for typing effect
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        // Add complete message after typing animation (but don't save to database)
        const initialMessage: ChatMessage = {
          role: "assistant",
          content: fullResponse,
        };
        setMessages([initialMessage]);
        setPartialMessage("");
      } else {
        toast.error(response.message || "Failed to load greeting");
      }
    } catch (error) {
      console.error("Failed to get initial greeting:", error);
      toast.error("Failed to load greeting");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !contractData?._id || disabled || suggestGeneration) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: userInput,
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);
    setIsStreaming(true);
    setPartialMessage("");

    try {
      const response = await aiChatService.sendMessage(
        contractData._id,
        userInput
      );

      if (response.success && response.data?.aiResponse) {
        const fullResponse = response.data.aiResponse;
        
        // Show typing effect - token by token
        let displayText = "";
        const tokens = fullResponse.split(" ");
        
        for (let i = 0; i < tokens.length; i++) {
          displayText += tokens[i] + " ";
          setPartialMessage(displayText);
          // Add small delay between tokens for typing effect
          await new Promise(resolve => setTimeout(resolve, 20));
        }
        
        // Add complete message after typing animation
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: fullResponse,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setPartialMessage("");

        // Check if generation should be suggested
        if (response.data.suggestGeneration) {
          setSuggestGeneration(true);
          toast.success("Contract is ready to be generated!");
        }
      } else {
        toast.error(response.message || "Failed to get AI response");
        // Remove the user message if AI response failed
        setMessages((prev) => prev.slice(0, -1));
        setUserInput(userMessage.content);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
      setUserInput(userMessage.content);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // const handleGenerateContract = () => {
  //   if (!contractData?._id || disabled) return;

  //   console.log("Generate Contract clicked", {
  //     contractId: contractData._id,
  //     contractTitle: contractData.contractTitle,
  //     chatMessages: messages,
  //   });
    
  //   toast.success("Contract generation initiated!");
  // };

  if (disabled || !contractData) {
    return (
      <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Select a contract to start strategic discussion
          </p>
        </div>
      </div>
    );
  }

  if (isChatLoading) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent rounded-t-lg -m-6 mb-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="text-[#dc2626] bg-gradient-to-r from-[#dc2626]/20 to-[#E11D48]/10 p-2 rounded-lg border border-[#dc2626]/20">
              <FiMessageCircle className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white tracking-tight text-xs">
              AI Contract Assistant
            </h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 animate-pulse text-sm">
            Loading strategic discussion...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
      {/* Header - Minimal & Elegant */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-white/[0.02] to-transparent">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-gradient-to-br from-[#dc2626] to-[#E11D48] p-1.5 rounded-lg text-white shadow-lg flex-shrink-0">
            <FiMessageCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm tracking-tight truncate">
                {contractData?.contractTitle || "Contract"}
              </h3>
              {suggestGeneration && (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-900/40 text-green-300 rounded border border-green-700/50 flex-shrink-0">
                  Ready
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Generate Button in Header - Right Side */}
        {suggestGeneration && (
          <button
            onClick={() => {
                  navigate("/ai-tools/legal/generate", {
                    state: {
                      contractId: contractData._id,
                      contractTitle: contractData.contractTitle,
                    },
                  });
                }}
            className="bg-gradient-to-r from-[#dc2626] to-[#E11D48] text-white font-semibold py-1.5 px-3.5 rounded-lg hover:shadow-xl hover:shadow-[#dc2626]/40 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs tracking-tight whitespace-nowrap"
          >
            <FiZap className="w-3.5 h-3.5" />
            Generate
          </button>
        )}
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" ref={messagesContainerRef}>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              msg.role === "user"
                ? "bg-gradient-to-br from-[#dc2626] to-[#E11D48]"
                : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}>
              {msg.role === "user" ? (
                <FiUser className="w-4 h-4 text-white" />
              ) : (
                <RiRobot2Fill className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words transition-all duration-200 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#dc2626] to-[#E11D48] text-white shadow-md shadow-[#dc2626]/15 rounded-tr-none"
                    : "bg-white/[0.08] border border-white/10 text-gray-100 hover:bg-white/[0.11] hover:border-white/15 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
              {/* Time stamp placeholder for future enhancement */}
              <span className={`text-xs mt-1 opacity-40 ${
                msg.role === "user" ? "text-gray-400" : "text-gray-500"
              }`}>
                {/* Add timestamp if needed */}
              </span>
            </div>
          </div>
        ))}
        
        {/* Streaming/Typing Message */}
        {isStreaming && partialMessage && (
          <div className="flex items-end gap-3">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
              <RiRobot2Fill className="w-4 h-4 text-white" />
            </div>
            
            {/* Streaming Message Bubble */}
            <div className="flex flex-col items-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.08] border border-white/10 text-gray-100 relative break-words transition-all duration-200 rounded-tl-none">
                <div className="relative flex items-center gap-1">
                  <span>{partialMessage}</span>
                  {/* Blinking cursor */}
                  <span className="inline-block w-2 h-5 bg-[#dc2626] animate-pulse rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading indicator for thinking */}
        {isLoading && !partialMessage && (
          <div className="flex items-end gap-3">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
              <RiRobot2Fill className="w-4 h-4 text-white" />
            </div>
            
            {/* Thinking Indicator */}
            <div className="bg-white/[0.08] border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200" />
                <span className="text-xs text-gray-500 ml-1">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent backdrop-blur-sm p-4 flex-shrink-0">
        <div className="flex items-end gap-3">
          {/* Textarea - No border */}
          <textarea
            ref={textAreaRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleTextAreaKeyPress}
            placeholder={suggestGeneration ? "Chat Complete - Ready to Generate" : "Type your message..."}
            disabled={isLoading || suggestGeneration}
            rows={1}
            className="flex-1 bg-white/[0.04] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:bg-white/[0.06] disabled:opacity-50 transition-all resize-none max-h-32"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim() || suggestGeneration}
            className="bg-gradient-to-r from-[#dc2626] to-[#E11D48] hover:from-[#E11D48] hover:to-[#dc2626] text-white px-4 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-[#dc2626]/20 hover:shadow-[#dc2626]/40 flex-shrink-0"
          >
            <FiSend className="w-4 h-4" />
            Send
          </button>
        </div>

        {/* Word count indicator - Optional, below input */}
        {!suggestGeneration && (
          <span className="text-xs text-gray-600 mt-2 block">
            {userInput.trim().split(/\s+/).filter((w) => w.length > 0).length} words • {userInput.length} characters
          </span>
        )}
        {suggestGeneration && (
          <span className="text-xs text-green-400 mt-2 block">✓ Ready for generation</span>
        )}
        
        {/* Guardrails Disclaimer - Concise */}
        <div className="px-4 py-2 text-xs text-yellow-100">
          <span className="flex items-center justify-center gap-2 opacity-50">
            <FiAlertCircle className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
            <span><strong>Disclaimer:</strong> AI-generated draft only. NOT legal advice. Have a lawyer review before signing.</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NinjaStrategist;
