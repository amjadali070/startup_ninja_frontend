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
}

export const schedulerService = new SchedulerService();


