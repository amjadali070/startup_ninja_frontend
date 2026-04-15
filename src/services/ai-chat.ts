import { apiClient } from "./apiClient";

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ContractChat {
  _id?: string;
  contractId: string;
  userId: string;
  messages: ChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data?: {
    messages: ChatMessage[];
    aiResponse: string;
    suggestGeneration?: boolean;
  };
  error?: string;
}

export interface GreetingResponse {
  success: boolean;
  message: string;
  data?: {
    greeting: string;
  };
  error?: string;
}

/**
 * AI Chat Service for Ninja Legal Strategist
 * Handles contract-related chat interactions
 */
export const aiChatService = {
  /**
   * Send a message in contract chat
   * @param contractId - Contract ID
   * @param userMessage - User's message
   */
  async sendMessage(
    contractId: string,
    userMessage: string
  ): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ChatResponse>(
        `/ai-legal/contract-chat/${contractId}`,
        { message: userMessage }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to send message",
        error: error.message,
      };
    }
  },

  /**
   * Get chat history for a contract
   * @param contractId - Contract ID
   */
  async getChatHistory(contractId: string): Promise<ChatResponse> {
    try {
      const response = await apiClient.get<ChatResponse>(
        `/ai-legal/contract-chat/${contractId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch chat history",
        error: error.message,
      };
    }
  },

  /**
   * Get initial AI greeting for a contract (saves to database)
   * @param contractId - Contract ID
   */
  async getInitialGreeting(contractId: string): Promise<GreetingResponse> {
    try {
      const response = await apiClient.get<GreetingResponse>(
        `/ai-legal/contract-greeting/${contractId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch greeting",
        error: error.message,
      };
    }
  },
};
