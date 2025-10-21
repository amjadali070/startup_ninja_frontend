import { apiClient } from './apiClient';

export interface ScheduledPostItem {
  _id: string;
  caption: string;
  image?: { originalname?: string; mimetype?: string; buffer?: string } | null;
  platforms: string[];
  accounts?: Array<{ platform: string; name?: string; username?: string; profileImage?: string }>;
  scheduledAt?: string;
  publishedAt?: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  results?: Record<string, any>;
  createdAt: string;
}

class SchedulerService {
  private readonly baseURL = '/social-media/scheduler';

  async getById(id: string): Promise<{ success: boolean; data?: ScheduledPostItem }>{
    return apiClient.get(`${this.baseURL}/schedule/${id}`);
  }

  // Optional deletion of a published post record (backend may choose to soft-delete or mark cancelled)
  async deletePost(id: string): Promise<{ success: boolean }>{
    // If backend doesn't have a delete endpoint yet, this can be adapted; for now, call cancel for parity or a placeholder
    try {
      // Attempt DELETE to same route; gateway should proxy if implemented
      return await apiClient.delete(`${this.baseURL}/schedule/${id}`);
    } catch (e: any) {
      return { success: false };
    }
  }
}

export const schedulerService = new SchedulerService();


