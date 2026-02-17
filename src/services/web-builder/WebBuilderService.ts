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

export interface SEOSettings {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    ogImage?: string | null;
    favicon?: string | null;
    isNoIndex?: boolean;
}

export interface WebsiteProject {
    _id: string;
    websiteTitle: string;
    websiteDescription: string;
    websiteData: any;
    userId: string;
    status: number;
    publishedLink: string | null;
    customDomain: string | null;
    customDomainStatus: 'pending' | 'verified' | 'failed';
    customDomainVerifiedAt: string | null;
    seoSettings?: SEOSettings;
    createdAt: string;
    updatedAt: string;
}

export interface DomainActionResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface WebsiteDataResponse {
    success: boolean;
    message: string;
    data?: WebsiteProject;
}

export interface PublishWebsiteResponse {
        success: boolean;
        message: string;
        data?: {
            websiteId: string;
            publishedUrl: string;
            fullUrl: string;
            publishedAt: string;
            isUpdate: boolean;
        };
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

    /**
     * Publish website to make it publicly accessible
     */
    async publishWebsite(
        userId: string,
        websiteId: string,
        websiteHtml: string
    ): Promise<PublishWebsiteResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/publish-website`, {
                userId,
                websiteId,
                websiteHtml,
            });

            return {
                success: response.success,
                message: response.message,
                data: response.data,
            };
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Failed to publish website.";
            return {
                success: false,
                message: errorMessage,
            };
        }
    }


    /**
     * Connect custom domain to a website project
     */
    async connectDomain(userId: string, websiteId: string, domain: string): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/connect-domain`, {
                userId,
                websiteId,
                domain
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to connect domain."
            };
        }
    }

    /**
     * Verify custom domain DNS
     */
    async verifyDomain(userId: string, websiteId: string): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/verify-domain`, {
                userId,
                websiteId
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to verify domain."
            };
        }
    }

    /**
     * Update SEO settings for a website project
     */
    async updateSEO(userId: string, websiteId: string, seoSettings: SEOSettings): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/update-seo`, {
                userId,
                websiteId,
                seoSettings
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update SEO settings."
            };
        }
    }

    /**
     * Upload favicon for a website project
     */
    async uploadFavicon(userId: string, websiteId: string, file: File): Promise<DomainActionResponse> {
        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('websiteId', websiteId);
            formData.append('favicon', file);

            const response = await apiClient.post(`${this.baseURL}/upload-favicon`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to upload favicon."
            };
        }
    }

    /**
     * Disconnect custom domain
     */
    async disconnectDomain(userId: string, websiteId: string): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/disconnect-domain`, {
                userId,
                websiteId
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to disconnect domain."
            };
        }
    }

    /**
     * Get all pages for a website
     */
    async getPages(userId: string, websiteId: string): Promise<any> {
        try {
            const response = await apiClient.get(`${this.baseURL}/pages`, {
                params: { userId, websiteId }
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to fetch pages.",
                data: []
            };
        }
    }

    /**
     * Create a new page
     */
    async createPage(userId: string, websiteId: string, slug: string, title: string): Promise<any> {
        try {
            const response = await apiClient.post(`${this.baseURL}/pages/create`, {
                userId,
                websiteId,
                slug,
                title
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to create page."
            };
        }
    }

    /**
     * Update a page
     */
    async updatePage(userId: string, websiteId: string, slug: string, title?: string, pageData?: any): Promise<any> {
        try {
            const response = await apiClient.put(`${this.baseURL}/pages/update`, {
                userId,
                websiteId,
                slug,
                title,
                pageData
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update page."
            };
        }
    }

    /**
     * Delete a page
     */
    async deletePage(userId: string, websiteId: string, slug: string): Promise<any> {
        try {
            const response = await apiClient.delete(`${this.baseURL}/pages/delete`, {
                data: {
                    userId,
                    websiteId,
                    slug
                }
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to delete page."
            };
        }
    }

}
export default new WebBuilderService();