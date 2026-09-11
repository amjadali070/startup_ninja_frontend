import { apiClient } from "../apiClient";

export interface TemplatePage {
    name: string;
    component: string;
}

export interface WebsiteTemplate {
    _id: string;
    templateId: string;
    name: string;
    industry: string;
    vibes: string[];
    primaryColor?: string | null;
    thumbnail: string | null;
    isActive: boolean;
    pages: TemplatePage[];
}

export interface TemplateListResponse {
    success: boolean;
    message?: string;
    data?: WebsiteTemplate[];
}

export interface TemplateDetailResponse {
    success: boolean;
    message?: string;
    data?: WebsiteTemplate;
}

class TemplateService {
    private baseURL = '/website-builder';

    /**
     * List all active website templates (full content included — see
     * TemplateController.listTemplates on the backend for why this isn't
     * paginated/lightweight the way most other listings are).
     */
    async getTemplates(): Promise<TemplateListResponse> {
        try {
            const response = await apiClient.get(`${this.baseURL}/templates`);
            return { success: response.success, message: response.message, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to fetch templates.";
            return { success: false, message: errorMessage };
        }
    }

    /**
     * Fetch a single template by its stable slug.
     */
    async getTemplate(templateId: string): Promise<TemplateDetailResponse> {
        try {
            const response = await apiClient.get(`${this.baseURL}/templates/${templateId}`);
            return { success: response.success, message: response.message, data: response.data };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Failed to fetch template.";
            return { success: false, message: errorMessage };
        }
    }
}

export default new TemplateService();
