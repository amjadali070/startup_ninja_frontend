import { apiClient } from "../apiClient";

export interface CreateWebsiteResponse {
    success: boolean;
    message: string;
    data?: {
        projectId: string;
        projectUrl?: string;
    };
}

export interface WebsiteListingResponse {
    success: boolean;
    message: string;
    data?: WebsiteProject[];
}

export interface WebsiteProject {
    _id: string;
    websiteTitle: string;
    websiteDescription: string;
    websiteData: any;
    userId: string;
    status: number;
    publishedLink: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface WebsiteDataResponse {
    success: boolean;
    message: string;
    data?: WebsiteProject;
}


class WebBuilderService {
    private baseURL = '/website-builder';

    /**
     * Create a new website project
     */
    async createWebsiteProject(formData: FormData): Promise<CreateWebsiteResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/create`, formData);

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create website project';
            return {
                success: false,
                message: errorMessage,
            };
        }
    }
    /**
    * Fetch all websites for a given user
    */
    async getUserWebsites(userId: string): Promise<WebsiteListingResponse> {
        try {
            const response = await apiClient.get(`${this.baseURL}/user-listing`, {
                params: { userId },
            });

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to fetch website projects for user.";
            return {
                success: false,
                message: errorMessage,
            };
        }
    }
    /**
     * Fetch a specific website's data by ID and user ID
     */
    async getWebsiteData(userId: string, websiteId: string): Promise<WebsiteDataResponse> {
        try {
            const response = await apiClient.get(`${this.baseURL}/website-data`, {
                params: { userId, websiteId },
            });

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                "Failed to fetch website data.";
            return {
                success: false,
                message: errorMessage,
            };
        }
    }
    /**
     * Save website data to backend
     */
    async saveWebsiteData(
        userId: string,
        websiteId: string,
        websiteData: any,
        websitePreview: string, // screenshot (base64)
    ): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.post(`${this.baseURL}/save-website-data`, {
                userId,
                websiteId,
                websiteData,
                websitePreview,
            });
            // console.log("Response: " , response.data);

            return {
                success: response.success,
                message: response.message,
            };
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Failed to save website data.";
            return {
                success: false,
                message: errorMessage,
            };
        }
    }


}
export default new WebBuilderService();