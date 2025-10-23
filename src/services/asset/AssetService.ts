import { apiClient } from '../apiClient';

export interface Asset {
    id: string;
    src: string;
    name: string;
    mimeType: string;
    type?: string;
    size?: number;
    filename?: string;
    file_path?: string;
    file_type?: string;
    timestamp?: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    data: Asset[];
}

export interface LoadResponse {
    success: boolean;
    message: string;
    data: {
        assets: Asset[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface DeleteResponse {
    success: boolean;
    message: string;
    data: {
        deleted: Array<{ id: string; filename: string }>;
        failed: Array<{ id: string; reason: string }>;
    };
}

class AssetService {
    private baseURL = '/website-builder/assets';

    /**
     * Upload assets to the server
     */
    async uploadAssets(files: File[]): Promise<Asset[]> {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            // Use raw axios instance for file uploads to avoid Content-Type conflicts
            const response = await apiClient.getAxiosInstance().post(`${this.baseURL}/upload`, formData, {
                headers: {
                    'Content-Type': undefined, // Let axios set the Content-Type with boundary
                },
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Upload failed');
            }

            return response.data.data;
        } catch (error: any) {
            console.error('Error uploading assets:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
            throw new Error(errorMessage);
        }
    }

    /**
     * Load assets from the server
     */
    async loadAssets(page: number = 1, limit: number = 50, fileType?: string): Promise<LoadResponse['data']> {
        try {
            const params: any = {
                page: page.toString(),
                limit: limit.toString(),
            };

            if (fileType) {
                params.file_type = fileType;
            }

            const response = await apiClient.get(`${this.baseURL}/load`, {
                params,
            });

            if (!response.success) {
                throw new Error(response.message || 'Load failed');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error loading assets:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Load failed';
            throw new Error(errorMessage);
        }
    }

    /**
     * Delete assets from the server
     */
    async deleteAssets(assetIds: string[]): Promise<DeleteResponse['data']> {
        try {
            const response = await apiClient.delete(`${this.baseURL}/delete`, {
                data: { assetIds },
            });

            if (!response.success) {
                throw new Error(response.message || 'Delete failed');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error deleting assets:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Delete failed';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get a single asset by ID
     */
    async getAsset(assetId: string): Promise<Asset> {
        try {
            const response = await apiClient.get(`${this.baseURL}/asset/${assetId}`);

            if (!response.success) {
                throw new Error(response.message || 'Get asset failed');
            }

            return response.data;
        } catch (error: any) {
            console.error('Error getting asset:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Get asset failed';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get the full URL for an asset
     */
    getAssetUrl(filename: string): string {
        return `${apiClient.getAxiosInstance().defaults.baseURL}${this.baseURL}/file/${filename}`;
    }
}

export default new AssetService();
