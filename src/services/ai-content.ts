import { apiClient } from './apiClient';
import {
  GenerateChatMessageRequest,
  GenerateChatMessageResponse,
  GetUserChatsResponse,
  GetChatHistoryResponse,
  DeleteChatResponse,
  UpdateChatTitleRequest,
  UpdateChatTitleResponse,
} from '../types/ai-content';

export const aiContentService = {
  /**
   * Generate AI content (create new chat or continue existing)
   */
  async generateChatMessage(
    request: GenerateChatMessageRequest
  ): Promise<GenerateChatMessageResponse> {
    try {
      const response = await apiClient.post<GenerateChatMessageResponse>(
        '/ai-content/chat',
        request
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate chat message',
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Get all chats for the authenticated user
   */
  async getUserChats(): Promise<GetUserChatsResponse> {
    try {
      const response = await apiClient.get<GetUserChatsResponse>('/ai-content/chats');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch chats',
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
        message: error.response?.data?.message || 'Failed to fetch chat history',
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
        message: error.response?.data?.message || 'Failed to delete chat',
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
        message: error.response?.data?.message || 'Failed to update chat title',
        errors: error.response?.data?.errors,
      };
    }
  },
};
