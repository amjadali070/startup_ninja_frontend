import { apiClient } from './apiClient';

export interface PlanLimit {
  ai_chat_messages: number;
  social_posts: number;
  ai_post_writer: number;
  generated_images: number;
  file_uploads: number;
  website_creation: number;
  website_hosting: number;
  single_page_website: boolean;
  multi_page_website: boolean;
  facebook_page_connect: number;
  chat_bot_messages: number;
  web_builder_sessions: number;
  team_members: number;
  legal_contracts: number;
  legal_contract_section_revisions: number;
  sales_leads: number;
  sales_projects: number;
}

export interface Plan {
  _id: string;
  key: string;
  name: string;
  price: number;
  discountPrice?: number;
  description?: string;
  features: string[];
  limits: PlanLimit;
  isPopular: boolean;
}

export const planService = {
  getAllPlans: async () => {
    try {
        const response = await apiClient.get<{success: boolean, data: Plan[]}>('/admin/plans');
        return response; // Axios response data is usually handled by apiClient wrapper? 
        // Checking authService: response = await apiClient.post(...) -> response.success.
        // It seems apiClient returns the data directly (interceptors).
        // So I should return response.
    } catch (error) {
        console.error("Failed to fetch plans", error);
        throw error;
    }
  },
  
  updatePlan: async (id: string, updates: Partial<Plan>) => {
    const response = await apiClient.put<{success: boolean, data: Plan}>(`/admin/plans/${id}`, updates);
    return response;
  }
};
