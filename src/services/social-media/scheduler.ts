import { apiClient } from '../apiClient';

export interface SchedulePostRequest {
  caption?: string;
  platforms: Array<'facebook' | 'instagram' | 'x' | 'linkedin'>;
  scheduledDate?: string; // YYYY-MM-DD (fallback when schedules not provided)
  scheduledTime?: string; // HH:mm (fallback when schedules not provided)
  schedules?: Array<{ platform: 'facebook' | 'instagram' | 'x' | 'linkedin'; date: string; time: string }>;
  imageFile?: File | null;
  targetAccounts?: Record<string, string[]>;
}

export interface SchedulePostResponse {
  success: boolean;
  message: string;
  data?: { id: string; jobId: string; scheduledAt: string };
}

class SchedulerService {
  private baseURL = '/social-media/scheduler';

  async schedulePost(req: SchedulePostRequest): Promise<SchedulePostResponse> {
    const formData = new FormData();
    if (req.caption) formData.append('caption', req.caption);
    formData.append('platforms', JSON.stringify(req.platforms));
    if (req.schedules && req.schedules.length > 0) {
      formData.append('schedules', JSON.stringify(req.schedules));
    } else if (req.scheduledDate && req.scheduledTime) {
      formData.append('scheduledDate', req.scheduledDate);
      formData.append('scheduledTime', req.scheduledTime);
    }
    if (req.imageFile) formData.append('image', req.imageFile);
    if (req.targetAccounts) {
      formData.append('targetAccounts', JSON.stringify(req.targetAccounts));
    }

    const resp = await apiClient.post(`${this.baseURL}/schedule`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resp as SchedulePostResponse;
  }

  async listScheduled(): Promise<any[]> {
    const resp = await apiClient.get(`${this.baseURL}/schedule?includeImage=true`);
    return resp.data || [];
  }

  async cancelScheduled(id: string): Promise<{ success: boolean; message: string }> {
    const resp = await apiClient.delete(`${this.baseURL}/schedule/${id}`);
    return resp;
  }

  async deletePost(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const resp = await apiClient.delete(`${this.baseURL}/schedule/${id}/delete`);
      return resp;
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to delete post' };
    }
  }
}

export default new SchedulerService();


