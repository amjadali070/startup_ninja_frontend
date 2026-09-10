import { apiClient } from './apiClient';

export interface SupportReply {
  authorId: string;
  authorName: string;
  isAdmin: boolean;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  userId: string | { _id: string; fullname: string; email: string };
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  replies: SupportReply[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const supportService = {
  async createTicket(subject: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<ApiResponse<SupportTicket>> {
    try {
      return await apiClient.post<ApiResponse<SupportTicket>>('/support/tickets', { subject, message, priority });
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to create ticket' };
    }
  },

  async listMyTickets(): Promise<ApiResponse<SupportTicket[]>> {
    try {
      return await apiClient.get<ApiResponse<SupportTicket[]>>('/support/tickets');
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch tickets' };
    }
  },

  async getTicket(id: string): Promise<ApiResponse<SupportTicket>> {
    try {
      return await apiClient.get<ApiResponse<SupportTicket>>(`/support/tickets/${id}`);
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to fetch ticket' };
    }
  },

  async replyToTicket(id: string, message: string): Promise<ApiResponse<SupportTicket>> {
    try {
      return await apiClient.post<ApiResponse<SupportTicket>>(`/support/tickets/${id}/reply`, { message });
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to add reply' };
    }
  },
};
