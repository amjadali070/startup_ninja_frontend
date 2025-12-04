import { apiClient } from "./apiClient";
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
  AnalyticsData,
  AIChat,
  SocialPost,
  Website,
  WebsiteAnalytics,
  SingleWebsiteAnalytics,
  ContentLogsResponse,
} from "../types/admin";

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
        "/admin/dashboard/stats"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch dashboard stats",
        error: error.message,
      };
    }
  },

  /**
   * Get AI Usage Statistics
   */
  async getAIUsage(): Promise<AdminApiResponse<AIModel[]>> {
    try {
      const response = await apiClient.get<AdminApiResponse<AIModel[]>>(
        "/admin/dashboard/ai-usage"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch AI usage",
        error: error.message,
      };
    }
  },

  /**
   * Get Realtime Usage Data
   */
  async getRealtimeUsage(
    timeframe: string = "week"
  ): Promise<AdminApiResponse<RealtimeUsageData>> {
    try {
      const response = await apiClient.get<AdminApiResponse<RealtimeUsageData>>(
        `/admin/dashboard/realtime-usage?timeframe=${timeframe}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch realtime usage",
        error: error.message,
      };
    }
  },

  /**
   * Get System Alerts
   */
  async getSystemAlerts(): Promise<AdminApiResponse<SystemAlert[]>> {
    try {
      const response = await apiClient.get<AdminApiResponse<SystemAlert[]>>(
        "/admin/system/alerts"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch system alerts",
        error: error.message,
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
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.role) queryParams.append("role", params.role);
      if (params?.status) queryParams.append("status", params.status);

      const response = await apiClient.get<AdminApiResponse<UsersResponse>>(
        `/admin/users?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch users",
        error: error.message,
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
        message: error.response?.data?.message || "Failed to fetch user",
        error: error.message,
      };
    }
  },

  /**
   * Update User
   */
  async updateUser(
    id: string,
    updates: Partial<UserDetails>
  ): Promise<AdminApiResponse<{ user: UserDetails }>> {
    try {
      const response = await apiClient.put<
        AdminApiResponse<{ user: UserDetails }>
      >(`/admin/users/${id}`, updates);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update user",
        error: error.message,
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
        message: error.response?.data?.message || "Failed to delete user",
        error: error.message,
      };
    }
  },

  /**
   * Get System Health
   */
  async getSystemHealth(): Promise<AdminApiResponse<SystemHealth>> {
    try {
      const response = await apiClient.get<AdminApiResponse<SystemHealth>>(
        "/admin/system/health"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch system health",
        error: error.message,
      };
    }
  },

  /**
   * Get Analytics Data
   */
  async getAnalytics(params?: {
    period?: "daily" | "weekly" | "monthly";
    type?: string;
  }): Promise<AdminApiResponse<AnalyticsData[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.period) queryParams.append("period", params.period);
      if (params?.type) queryParams.append("type", params.type);

      const response = await apiClient.get<AdminApiResponse<AnalyticsData[]>>(
        `/admin/dashboard/analytics?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch analytics",
        error: error.message,
      };
    }
  },

  /**
   * Get User's AI Chat History
   */
  async getUserAIChats(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<AIChat>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<
        AdminApiResponse<{ chats: AIChat[]; pagination: any }>
      >(`/admin/users/${userId}/ai-chats?${queryParams.toString()}`);

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.chats,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch AI chats",
        error: error.message,
      };
    }
  },

  /**
   * Get User's Social Media Posts
   */
  async getUserSocialPosts(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<SocialPost>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<
        AdminApiResponse<{ posts: SocialPost[]; pagination: any }>
      >(`/admin/users/${userId}/social-posts?${queryParams.toString()}`);

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.posts,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch social posts",
        error: error.message,
      };
    }
  },

  /**
   * Get User's Websites
   */
  async getUserWebsites(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<Website>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<
        AdminApiResponse<{ websites: Website[]; pagination: any }>
      >(`/admin/users/${userId}/websites?${queryParams.toString()}`);

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.websites,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch websites",
        error: error.message,
      };
    }
  },

  /**
   * Get User's Website Analytics
   * Returns detailed analytics including storage usage
   */
  async getUserWebsiteAnalytics(
    userId: string
  ): Promise<AdminApiResponse<WebsiteAnalytics>> {
    try {
      const response = await apiClient.get<AdminApiResponse<WebsiteAnalytics>>(
        `/admin/users/${userId}/website-analytics`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch website analytics",
        error: error.message,
      };
    }
  },

  /**
   * Get Single Website Analytics
   * Returns detailed analytics for a specific website
   */
  async getSingleWebsiteAnalytics(
    websiteId: string
  ): Promise<AdminApiResponse<SingleWebsiteAnalytics>> {
    try {
      const response = await apiClient.get<
        AdminApiResponse<SingleWebsiteAnalytics>
      >(`/admin/websites/${websiteId}/analytics`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch single website analytics",
        error: error.message,
      };
    }
  },
  

  /**
   * Reset User Password
   */
  async resetUserPassword(
    userId: string, 
    password: string
  ): Promise<AdminApiResponse<void>> {
    try {
      const response = await apiClient.post<AdminApiResponse<void>>(
        `/admin/users/${userId}/reset-password`,
        { password }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
        error: error.message,
      };
    }
  },
};
