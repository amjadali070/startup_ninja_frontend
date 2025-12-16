import { apiClient, ApiResponse } from "./apiClient";

export interface GeneratedImage {
  _id: string;
  userId: string;
  prompt: string;
  modelUsed: string;
  imageUrl: string;
  localPath: string | null;
  parameters: {
    aspectRatio: string;
    style: string;
  };
  cost: number;
  createdAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse {
  data: GeneratedImage[];
  pagination: PaginationInfo;
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
  async generateImage(
    params: GenerateImageParams
  ): Promise<ApiResponse<GeneratedImage>> {
    return await apiClient.post<ApiResponse<GeneratedImage>>(
      "/imaginative/generate",
      params
    );
  }

  /**
   * Get generation history with pagination
   */
  async getHistory(
    page: number = 1,
    limit: number = 12
  ): Promise<ApiResponse<PaginatedResponse>> {
    return await apiClient.get<ApiResponse<PaginatedResponse>>(
      `/imaginative/history?page=${page}&limit=${limit}`
    );
  }

  /**
   * Delete an image
   */
  async deleteImage(
    imageId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<ApiResponse<{ message: string }>>(
      `/imaginative/image/${imageId}`
    );
  }
}

export const imageGenService = new ImageGenService();
