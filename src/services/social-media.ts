import { apiClient } from "./apiClient";
import {
  EnhanceWithAIRequest,
  EnhanceWithAIResponse,
  WriteWithAIRequest,
  WriteWithAIResponse,
} from "../types/social-media";

export const socialMediaService = {
  /**
   * Enhance existing post content with AI
   */
  async enhanceWithAI(
    request: EnhanceWithAIRequest
  ): Promise<EnhanceWithAIResponse> {
    try {
      const response = await apiClient.post<EnhanceWithAIResponse>(
        "/social-media/ai/enhance",
        request
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to enhance content with AI",
        errors: error.response?.data?.errors,
      };
    }
  },

  /**
   * Generate new post content with AI
   */
  async writeWithAI(
    request: WriteWithAIRequest
  ): Promise<WriteWithAIResponse> {
    try {
      const response = await apiClient.post<WriteWithAIResponse>(
        "/social-media/ai/write",
        request
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to generate content with AI",
        errors: error.response?.data?.errors,
      };
    }
  },
};

