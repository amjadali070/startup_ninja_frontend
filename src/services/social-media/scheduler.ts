import { apiClient } from '../apiClient';
import { buildUTCFromTimezone } from '../../utils/date';

export interface SchedulePostRequest {
  caption?: string;
  platforms: Array<'facebook' | 'instagram' | 'x' | 'linkedin'>;
  scheduledDate?: string; // YYYY-MM-DD (fallback when schedules not provided)
  scheduledTime?: string; // HH:mm (fallback when schedules not provided)
  schedules?: Array<{ platform: 'facebook' | 'instagram' | 'x' | 'linkedin'; date: string; time: string }>;
  /** Up to 4 images (LinkedIn/X carousel). A single-element array behaves exactly like the old single-image field. */
  imageFiles?: File[];
  /** A single video (Reel/video post) — mutually exclusive with imageFiles, matching the immediate-publish rule. */
  videoFile?: File | null;
  targetAccounts?: Record<string, string[]>;
  /** IANA timezone of the user (e.g. "America/New_York"). When provided the
   *  frontend converts each schedule's date+time to a UTC ISO string before
   *  sending, and also passes the timezone so the backend can store it. */
  timezone?: string;
}

export interface SchedulePostResponse {
  success: boolean;
  message: string;
  data?: { id: string; jobId: string; scheduledAt: string };
}

export interface AnalyticsData {
  totalPosts: number;
  statusCounts: { draft: number; scheduled: number; published: number; failed: number; cancelled: number };
  platformCounts: Record<string, number>;
  dailyTrend: Array<{ date: string; count: number }>;
  successRate: number | null;
  connectedPlatforms: string[];
  rangeDays: number;
  /** Real likes/comments/shares from Facebook/Instagram's own APIs — postsCounted is how many posts this covers, not the total post count. */
  engagement: { totalLikes: number; totalComments: number; totalShares: number; postsCounted: number };
}

export interface CalendarPost {
  _id: string;
  caption: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
}

class SchedulerService {
  private baseURL = '/social-media/scheduler';

  async schedulePost(req: SchedulePostRequest): Promise<SchedulePostResponse> {
    const formData = new FormData();
    if (req.caption) formData.append('caption', req.caption);
    formData.append('platforms', JSON.stringify(req.platforms));
    if (req.schedules && req.schedules.length > 0) {
      // If a timezone is provided, convert each schedule's local date+time to
      // a UTC ISO string so the backend always receives unambiguous UTC times.
      if (req.timezone) {
        const utcSchedules = req.schedules.map(s => ({
          platform: s.platform,
          scheduledAt: buildUTCFromTimezone(s.date, s.time, req.timezone!),
          // Keep original date/time as fallback fields
          date: s.date,
          time: s.time,
        }));
        formData.append('schedules', JSON.stringify(utcSchedules));
        formData.append('timezone', req.timezone);
      } else {
        formData.append('schedules', JSON.stringify(req.schedules));
      }
    } else if (req.scheduledDate && req.scheduledTime) {
      formData.append('scheduledDate', req.scheduledDate);
      formData.append('scheduledTime', req.scheduledTime);
      if (req.timezone) formData.append('timezone', req.timezone);
    }
    // Images (carousel) or a single video — never both, matching the immediate-publish rule.
    if (req.videoFile) {
      formData.append('video', req.videoFile);
    } else {
      for (const f of req.imageFiles || []) formData.append('images', f);
    }
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

  /** Posts with a scheduledAt inside [startDate, endDate] (YYYY-MM-DD, inclusive) — drafts have no scheduledAt so they never appear here. */
  async listByDateRange(startDate: string, endDate: string): Promise<CalendarPost[]> {
    try {
      const resp = await apiClient.get(`${this.baseURL}/schedule`, {
        params: { startDate, endDate, pageSize: 100 },
      });
      return resp.data || [];
    } catch {
      return [];
    }
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

  /** Real counts derived from this account's own posts — no fabricated engagement numbers. */
  async getAnalytics(days = 30): Promise<{ success: boolean; message?: string; data?: AnalyticsData }> {
    try {
      const resp = await apiClient.get(`${this.baseURL}/analytics`, { params: { days } });
      return resp;
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message || e?.message || 'Failed to load analytics' };
    }
  }

  /** Persists caption/image without scheduling or publishing it — status: 'draft' in the same Post list. */
  async saveDraft(req: { caption?: string; platforms?: Array<'facebook' | 'instagram' | 'x' | 'linkedin'>; imageFile?: File | null }): Promise<{ success: boolean; message?: string; data?: { id: string } }> {
    try {
      const formData = new FormData();
      if (req.caption) formData.append('caption', req.caption);
      if (req.platforms && req.platforms.length > 0) {
        formData.append('platforms', JSON.stringify(req.platforms));
      }
      if (req.imageFile) formData.append('image', req.imageFile);

      const resp = await apiClient.post(`${this.baseURL}/draft`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return resp;
    } catch (e: any) {
      return { success: false, message: e?.response?.data?.message || e?.message || 'Failed to save draft' };
    }
  }
}

export default new SchedulerService();


