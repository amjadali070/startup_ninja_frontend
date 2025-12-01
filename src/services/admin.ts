import { apiClient } from './apiClient';
import type {
  AdminApiResponse,
  DashboardStats,
  AIModel,
  RealtimeUsageData,
  SystemAlert,
  UsersResponse,
  UserWithStats,
  UserDetails,
  SystemHealth,
  AnalyticsData
} from '../types/admin';

/**
 * Admin Service
 * Handles all admin-related API calls
 */
export const adminService = {
  /**
   * Get Dashboard Statistics
   * Returns overview metrics for the admin dashboard
   */
  async getDashboardStats(): Promise<AdminApiResponse<DashboardStats>> {
    try {
      const response = await apiClient.get<AdminApiResponse<DashboardStats>>(
        '/admin/dashboard/stats'
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard stats',
        error: error.message
      };
    }
  },

  /**
   * Get AI Usage Statistics
   */
  async getAIUsage(): Promise<AdminApiResponse<AIModel[]>> {
    try {
      const response = await apiClient.get<AdminApiResponse<AIModel[]>>(
        '/admin/dashboard/ai-usage'
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch AI usage',
        error: error.message
      };
    }
  },

  /**
   * Get Realtime Usage Data
   */
  async getRealtimeUsage(timeframe: string = 'week'): Promise<AdminApiResponse<RealtimeUsageData>> {
    try {
      const response = await apiClient.get<AdminApiResponse<RealtimeUsageData>>(
        `/admin/dashboard/realtime-usage?timeframe=${timeframe}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch realtime usage',
        error: error.message
      };
    }
  },

  /**
   * Get System Alerts
   */
  async getSystemAlerts(): Promise<AdminApiResponse<SystemAlert[]>> {
    try {
      const response = await apiClient.get<AdminApiResponse<SystemAlert[]>>(
        '/admin/system/alerts'
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch system alerts',
        error: error.message
      };
    }
  },

  /**
   * Get All Users (Paginated)
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<AdminApiResponse<UsersResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.role) queryParams.append('role', params.role);
      if (params?.status) queryParams.append('status', params.status);

      const response = await apiClient.get<AdminApiResponse<UsersResponse>>(
        `/admin/users?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        error: error.message
      };
    }
  },

  /**
   * Get User By ID
   */
  async getUserById(id: string): Promise<AdminApiResponse<UserWithStats>> {
    try {
      const response = await apiClient.get<AdminApiResponse<UserWithStats>>(
        `/admin/users/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
        error: error.message
      };
    }
  },

  /**
   * Update User
   */
  async updateUser(id: string, updates: Partial<UserDetails>): Promise<AdminApiResponse<{ user: UserDetails }>> {
    try {
      const response = await apiClient.put<AdminApiResponse<{ user: UserDetails }>>(
        `/admin/users/${id}`,
        updates
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
        error: error.message
      };
    }
  },

  /**
   * Delete User
   */
  async deleteUser(id: string): Promise<AdminApiResponse<void>> {
    try {
      const response = await apiClient.delete<AdminApiResponse<void>>(
        `/admin/users/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        error: error.message
      };
    }
  },

  /**
   * Get System Health
   */
  async getSystemHealth(): Promise<AdminApiResponse<SystemHealth>> {
    try {
      const response = await apiClient.get<AdminApiResponse<SystemHealth>>(
        '/admin/system/health'
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch system health',
        error: error.message
      };
    }
  },

  /**
   * Get Analytics Data
   */
  async getAnalytics(params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    type?: string;
  }): Promise<AdminApiResponse<AnalyticsData[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append('period', params.period);
      if (params?.type) queryParams.append('type', params.type);

      const response = await apiClient.get<AdminApiResponse<AnalyticsData[]>>(
        `/admin/dashboard/analytics?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics',
        error: error.message
      };
    }
  }
};
