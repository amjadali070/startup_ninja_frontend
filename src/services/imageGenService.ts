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
  preset?: string | null;
  cost: number;
  createdAt: string;
  parentImageId?: string | null;
  rootImageId?: string | null;
  versionNumber?: number;
  versionType?: "original" | "edit" | "variation";
  editInstruction?: string | null;
  brandAssetsApplied?: boolean;
  versionCount?: number;
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
  preset?: string;
  useBrandAssets?: boolean;
}

export interface BrandAssetProductImage {
  url: string;
  key: string;
  name: string;
}

export interface BrandAssets {
  userId?: string;
  logo?: { url: string | null; key?: string | null };
  colors: string[];
  fonts: string[];
  productImages: BrandAssetProductImage[];
  visualStyle: string;
}

export const IMAGE_PRESETS: { id: string; label: string; aspectRatio: string }[] = [
  { id: "instagram_post", label: "Instagram Post", aspectRatio: "1:1" },
  { id: "instagram_story", label: "Instagram Story", aspectRatio: "9:16" },
  { id: "poster", label: "Poster", aspectRatio: "3:4" },
  { id: "advertisement", label: "Advertisement", aspectRatio: "1:1" },
  { id: "website_hero", label: "Website Hero", aspectRatio: "16:9" },
  { id: "product_image", label: "Product Image", aspectRatio: "1:1" },
  { id: "youtube_thumbnail", label: "YouTube Thumbnail", aspectRatio: "16:9" },
  { id: "social_graphic", label: "Social Graphic", aspectRatio: "1:1" },
];

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
   * Iteratively edit an existing image ("Continue Editing")
   */
  async editImage(
    imageId: string,
    instruction: string,
    useBrandAssets?: boolean
  ): Promise<ApiResponse<GeneratedImage>> {
    return await apiClient.post<ApiResponse<GeneratedImage>>(
      `/imaginative/edit/${imageId}`,
      { instruction, useBrandAssets }
    );
  }

  /**
   * Create a creative variation of an existing image
   */
  async createVariation(
    imageId: string,
    instruction?: string
  ): Promise<ApiResponse<GeneratedImage>> {
    return await apiClient.post<ApiResponse<GeneratedImage>>(
      `/imaginative/variation/${imageId}`,
      { instruction }
    );
  }

  /**
   * Get the full version history for an image's lineage (version history + compare)
   */
  async getVersions(
    rootImageId: string
  ): Promise<ApiResponse<GeneratedImage[]>> {
    return await apiClient.get<ApiResponse<GeneratedImage[]>>(
      `/imaginative/versions/${rootImageId}`
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
   * Delete an image (and, if it's a root image, every version derived from it)
   */
  async deleteImage(
    imageId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<ApiResponse<{ message: string }>>(
      `/imaginative/image/${imageId}`
    );
  }

  /**
   * Get the current user's saved brand assets
   */
  async getBrandAssets(): Promise<ApiResponse<BrandAssets>> {
    return await apiClient.get<ApiResponse<BrandAssets>>(
      "/imaginative/brand-assets"
    );
  }

  /**
   * Save brand assets (logo/product image files + colors/fonts/visual style)
   */
  async saveBrandAssets(formData: FormData): Promise<ApiResponse<BrandAssets>> {
    return await apiClient.put<ApiResponse<BrandAssets>>(
      "/imaginative/brand-assets",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }
}

export const imageGenService = new ImageGenService();
