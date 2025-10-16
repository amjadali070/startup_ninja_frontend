import { apiClient } from './apiClient';

export interface SchedulePostRequest {
  caption?: string;
  platforms: Array<'facebook' | 'instagram' | 'x' | 'linkedin'>;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  imageFile?: File | null;
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
    formData.append('scheduledDate', req.scheduledDate);
    formData.append('scheduledTime', req.scheduledTime);
    if (req.imageFile) formData.append('image', req.imageFile);

    const resp = await apiClient.post(`${this.baseURL}/schedule`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return resp as SchedulePostResponse;
  }

  async listScheduled(): Promise<any[]> {
    const resp = await apiClient.get(`${this.baseURL}/schedule`);
    return resp.data || [];
  }

  async cancelScheduled(id: string): Promise<{ success: boolean; message: string }> {
    const resp = await apiClient.delete(`${this.baseURL}/schedule/${id}`);
    return resp;
  }
}

export default new SchedulerService();


