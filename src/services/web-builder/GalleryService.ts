import { apiClient } from "../apiClient";

export interface GalleryAsset {
  id: string;
  src: string;
  name: string;
  mimeType: string;
  size: number;
  filename: string;
  timestamp?: string;
}

export interface UploadAssetResponse {
  success: boolean;
  message: string;
  data?: GalleryAsset;
}

export interface UploadMultipleAssetsResponse {
  success: boolean;
  message: string;
  data?: GalleryAsset[];
}

export interface GetAssetsResponse {
  success: boolean;
  message?: string;
  data?: {
    items: GalleryAsset[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeleteAssetResponse {
  success: boolean;
  message: string;
}

class GalleryService {
  private baseURL = "/website-builder/gallery";

  /**
   * Upload a single asset
   */
  async uploadAsset(file: File): Promise<UploadAssetResponse> {
    try {
      const formData = new FormData();
      formData.append("asset", file);

      const response = await apiClient.post(
        `${this.baseURL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload asset.";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Upload multiple assets
   */
  async uploadMultipleAssets(
    files: File[]
  ): Promise<UploadMultipleAssetsResponse> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("assets", file);
      });

      const response = await apiClient.post(
        `${this.baseURL}/upload-multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload assets.";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Get user's assets with pagination
   */
  async getUserAssets(
    page: number = 1,
    limit: number = 50,
    type?: string
  ): Promise<GetAssetsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (type) {
        params.append("type", type);
      }

      const response = await apiClient.get(`${this.baseURL}/assets?${params}`);

      return {
        success: response.success,
        message: response.message,
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch assets.";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Delete a single asset
   */
  async deleteAsset(assetId: string): Promise<DeleteAssetResponse> {
    try {
      const response = await apiClient.delete(
        `${this.baseURL}/assets/${assetId}`
      );

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete asset.";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Delete multiple assets
   */
  async deleteMultipleAssets(assetIds: string[]): Promise<DeleteAssetResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/assets`, {
        data: { assetIds },
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete assets.";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Get asset URL for serving
   */
  getAssetUrl(userId: string, filename: string): string {
    const baseURL =
      import.meta.env.VITE_WEB_BUILDER_SERVICE_URL || "http://localhost:3004";
    return `${baseURL}/gallery/${userId}/${filename}`;
  }
}

export default new GalleryService();
