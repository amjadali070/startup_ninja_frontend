import { apiClient } from "../apiClient";
import { Memory, MemoryResponse, MemoryListResponse } from "../../types/ai-content";

export const memoryService = {
  async listMemories(): Promise<MemoryListResponse> {
    try {
      return await apiClient.get<MemoryListResponse>("/ai-content/memories");
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch memories" };
    }
  },

  async createMemory(content: string, sourceChatId?: string): Promise<MemoryResponse> {
    try {
      return await apiClient.post<MemoryResponse>("/ai-content/memories", { content, sourceChatId });
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to save memory" };
    }
  },

  async updateMemory(memoryId: string, content: string): Promise<MemoryResponse> {
    try {
      return await apiClient.put<MemoryResponse>(`/ai-content/memories/${memoryId}`, { content });
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update memory" };
    }
  },

  async deleteMemory(memoryId: string): Promise<{ success: boolean; message?: string }> {
    try {
      return await apiClient.delete(`/ai-content/memories/${memoryId}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete memory" };
    }
  },
};

export type { Memory };
