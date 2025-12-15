import { apiClient, ApiResponse } from "./apiClient";

export interface GeneratedImage {
  _id: string;
  userId: string;
  prompt: string;
  modelUsed: string;
  imageUrl: string;
  localPath: string;
  parameters: {
    aspectRatio: string;
    style: string;
  };
  cost: number;
  createdAt: string;
}

export interface GenerateImageParams {
  prompt: string;
  aspectRatio: string;
  style: string;
}

class ImageGenService {
  /**
   * Generate an image
   */
  async generateImage(params: GenerateImageParams): Promise<ApiResponse<GeneratedImage>> {
    return await apiClient.post<ApiResponse<GeneratedImage>>("/imaginative/generate", params);
  }

  /**
   * Get generation history
   */
  async getHistory(): Promise<ApiResponse<GeneratedImage[]>> {
    return await apiClient.get<ApiResponse<GeneratedImage[]>>("/imaginative/history");
  }

  /**
   * Delete an image
   */
  async deleteImage(imageId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<ApiResponse<{ message: string }>>(`/imaginative/image/${imageId}`);
  }
}

export const imageGenService = new ImageGenService();
