import { apiClient } from "../apiClient";
import {
  GenerateChatMessageRequest,
  GenerateChatMessageResponse,
  RegenerateMessageResponse,
  GetUserChatsResponse,
  GetChatHistoryResponse,
  DeleteChatResponse,
  UpdateChatTitleRequest,
  UpdateChatTitleResponse,
} from "../../types/ai-content";

export const aiContentService = {
  /**
   * Generate AI content (create new chat or continue existing).
   * Sends multipart/form-data when files are attached (the browser sets
   * the correct boundary itself even if a Content-Type is specified —
   * same pattern already used for the Phase 1 student-verification
   * upload), plain JSON otherwise.
   */
  async generateChatMessage(
    request: GenerateChatMessageRequest
  ): Promise<GenerateChatMessageResponse> {
    try {
      let response: GenerateChatMessageResponse;
      if (request.files && request.files.length > 0) {
        const formData = new FormData();
        formData.append("message", request.message);
        if (request.chatId) formData.append("chatId", request.chatId);
        if (request.enableSearch) formData.append("enableSearch", "true");
        request.files.forEach((file) => formData.append("files", file));

        response = await apiClient.post<GenerateChatMessageResponse>(
          "/ai-content/chat",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: request.onUploadProgress
              ? (evt) => {
                  const percent = evt.total
                    ? Math.round((evt.loaded / evt.total) * 100)
                    : 0;
                  request.onUploadProgress!(percent);
                }
              : undefined,
          }
        );
      } else {
        response = await apiClient.post<GenerateChatMessageResponse>(
          "/ai-content/chat",
          {
            message: request.message,
            chatId: request.chatId,
            enableSearch: request.enableSearch,
          }
        );
      }
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to generate chat message",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Edit a previous user message and regenerate the response
   */
  async editMessage(
    chatId: string,
    messageId: string,
    content: string
  ): Promise<GenerateChatMessageResponse> {
    try {
      const response = await apiClient.put<GenerateChatMessageResponse>(
        `/ai-content/chat/${chatId}/message/${messageId}`,
        { content }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to edit message",
      };
    }
  },

  /**
   * Regenerate the last assistant response in a chat
   */
  async regenerateMessage(chatId: string): Promise<RegenerateMessageResponse> {
    try {
      const response = await apiClient.post<RegenerateMessageResponse>(
        `/ai-content/chat/${chatId}/regenerate`,
        {}
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to regenerate response",
      };
    }
  },

  /**
   * Get all chats for the authenticated user, optionally filtered by a
   * search query across titles/prompts/response text.
   */
  async getUserChats(query?: string): Promise<GetUserChatsResponse> {
    try {
      const response = await apiClient.get<GetUserChatsResponse>(
        "/ai-content/chats",
        query ? { params: { q: query } } : undefined
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch chats",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Get chat history by chat ID
   */
  async getChatHistory(chatId: string): Promise<GetChatHistoryResponse> {
    try {
      const response = await apiClient.get<GetChatHistoryResponse>(
        `/ai-content/chat/${chatId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch chat history",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<DeleteChatResponse> {
    try {
      const response = await apiClient.delete<DeleteChatResponse>(
        `/ai-content/chat/${chatId}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete chat",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Update chat title
   */
  async updateChatTitle(
    chatId: string,
    request: UpdateChatTitleRequest
  ): Promise<UpdateChatTitleResponse> {
    try {
      const response = await apiClient.put<UpdateChatTitleResponse>(
        `/ai-content/chat/${chatId}/title`,
        request
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update chat title",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Export chat to document
   */
  async exportChat(chatId: string, format: "pdf" | "docx"): Promise<Blob | { success: false; message: string }> {
    try {
      const data = await apiClient.get<Blob>(
        `/ai-content/chat/${chatId}/export?format=${format}`,
        { responseType: "blob" }
      );

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: "Failed to export chat (Limit exceeded or server error)",
      };
    }
  },
};
