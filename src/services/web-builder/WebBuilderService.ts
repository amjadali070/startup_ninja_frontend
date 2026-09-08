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

export interface SocialLinks {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
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
    logoUrl?: string | null;
    brandColor?: string | null;
    socialLinks?: SocialLinks;
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

export interface WebsiteVersion {
    _id: string;
    websiteId: string;
    userId: string;
    label: string | null;
    createdAt: string;
}

export interface VersionListResponse {
    success: boolean;
    message?: string;
    data?: WebsiteVersion[];
}

export interface RestoreVersionResponse {
    success: boolean;
    message: string;
    data?: { websiteId: string; websiteData: any };
}

export type AiEditMode = 'rewrite' | 'redesign' | 'ask';

export interface AiEditSectionResponse {
    success: boolean;
    message: string;
    data?: { html: string };
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
     * Delete a website (cascades cleanup of its S3 assets and documents server-side)
     */
    async deleteWebsite(userId: string, websiteId: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await apiClient.delete(`${this.baseURL}/${websiteId}`, {
                params: { userId },
            });
            return { success: response.success, message: response.message };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to delete website.";
            return { success: false, message: errorMessage };
        }
    }
    /**
     * List version history for a website
     */
    async listVersions(userId: string, websiteId: string): Promise<VersionListResponse> {
        try {
            const response = await apiClient.get(`${this.baseURL}/versions/${websiteId}`, {
                params: { userId },
            });
            return { success: response.success, message: response.message, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to load version history.";
            return { success: false, message: errorMessage };
        }
    }
    /**
     * Restore a website to a previous version
     */
    async restoreVersion(userId: string, websiteId: string, versionId: string): Promise<RestoreVersionResponse> {
        try {
            const response = await apiClient.post(
                `${this.baseURL}/versions/${websiteId}/${versionId}/restore`,
                {},
                { params: { userId } }
            );
            return { success: response.success, message: response.message, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to restore version.";
            return { success: false, message: errorMessage };
        }
    }
    /**
     * "Ask Ninja" / AI Rewrite Section / AI Redesign Section — sends the
     * HTML of whatever's selected in the editor (or the whole page body if
     * nothing's selected) plus a plain-English instruction, gets back
     * edited HTML using only inline styles (see backend openaiService.js).
     */
    async aiEditSection(
        userId: string,
        websiteId: string,
        html: string,
        instruction: string,
        mode: AiEditMode = 'ask'
    ): Promise<AiEditSectionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/ai/edit-section`, {
                userId,
                websiteId,
                html,
                instruction,
                mode,
            });
            return { success: response.success, message: response.message, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to generate AI edit.";
            return { success: false, message: errorMessage };
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
     * Attempt automatic DNS configuration via a supported registrar's API
     * (GoDaddy or Namecheap) instead of manual DNS setup. Falls back
     * gracefully — a "not configured" response is expected and normal
     * until real registrar credentials exist; the manual instructions
     * remain the primary path either way.
     */
    async autoConfigureDns(userId: string, websiteId: string, registrar: 'godaddy' | 'namecheap'): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/auto-configure-dns`, {
                userId,
                websiteId,
                registrar
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Automatic DNS setup failed."
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
     * Update site-wide social links (filled into the "Social Links" canvas
     * block's placeholder hrefs at publish time)
     */
    async updateSocialLinks(userId: string, websiteId: string, socialLinks: SocialLinks): Promise<DomainActionResponse> {
        try {
            const response = await apiClient.post(`${this.baseURL}/update-social-links`, {
                userId,
                websiteId,
                socialLinks
            });
            return response;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Failed to update social links."
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