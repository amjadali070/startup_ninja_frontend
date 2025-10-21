import { apiClient } from './apiClient';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'scheduled' | 'published';

export interface NotificationItem {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ListNotificationsResponse {
  success: boolean;
  data: NotificationItem[];
  total: number;
  page: number;
  pageSize: number;
}

class NotificationsService {
  private readonly baseURL = '/social-media/notifications';

  async list(page = 1, pageSize = 20): Promise<ListNotificationsResponse> {
    return apiClient.get(`${this.baseURL}`, { params: { page, pageSize } });
  }

  async markAsRead(id: string): Promise<{ success: boolean }>{
    return apiClient.post(`${this.baseURL}/${id}/read`, {});
  }

  async markAllAsRead(): Promise<{ success: boolean }>{
    return apiClient.post(`${this.baseURL}/read-all`, {});
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;


