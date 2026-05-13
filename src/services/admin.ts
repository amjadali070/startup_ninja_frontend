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
  GeneratedImage,
  SocialPost,
  Website,
  WebsiteAnalytics,
  SingleWebsiteAnalytics,
  ContentLogsResponse,
  APIProvider,
  APIUsageData,
  OpenAIUsageBreakdown,
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
  async updateUserResources(
    id: string,
    data: any
  ): Promise<AdminApiResponse<any>> {
    try {
      const response = await apiClient.put<AdminApiResponse<any>>(
        `/admin/users/${id}/resources`,
        data
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update resources",
        error: error.message,
      };
    }
  },

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
   * Get User's Generated Images History
   */
  async getUserGeneratedImages(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<GeneratedImage>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<
        AdminApiResponse<{ images: GeneratedImage[]; pagination: any }>
      >(`/admin/users/${userId}/generated-images?${queryParams.toString()}`);

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.images,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch generated images",
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
   * Get User's Sales Leads
   */
  async getUserLeads(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<AdminApiResponse<any>>(
        `/admin/users/${userId}/leads?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.data,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch leads",
        error: error.message,
      };
    }
  },

  /**
   * Get User's Sales Projects
   */
  async getUserProjects(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<AdminApiResponse<any>>(
        `/admin/users/${userId}/projects?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.data,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch projects",
        error: error.message,
      };
    }
  },

  /**
   * Get User's Legal Contracts
   */
  async getUserContracts(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<AdminApiResponse<ContentLogsResponse<any>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<AdminApiResponse<any>>(
        `/admin/users/${userId}/contracts?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            data: response.data.data,
            pagination: response.data.pagination,
          },
        };
      }
      return response as any;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch contracts",
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

  /**
   * Get OpenAI API Balance
   */
  async getOpenAIBalance(): Promise<AdminApiResponse<APIProvider>> {
    try {
      const response = await apiClient.get<AdminApiResponse<APIProvider>>(
        "/admin/api-management/openai/balance"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch OpenAI balance",
        error: error.message,
      };
    }
  },

  /**
   * Get OpenAI API Usage
   */
  async getOpenAIUsage(params?: {
    startTime?: number;
    endTime?: number;
  }): Promise<AdminApiResponse<APIUsageData>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startTime) queryParams.append("startTime", params.startTime.toString());
      if (params?.endTime) queryParams.append("endTime", params.endTime.toString());

      const response = await apiClient.get<AdminApiResponse<APIUsageData>>(
        `/admin/api-management/openai/usage?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch OpenAI usage",
        error: error.message,
      };
    }
  },

  /**
   * Get OpenAI Usage Breakdown
   */
  async getOpenAIUsageBreakdown(params?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
  }): Promise<AdminApiResponse<OpenAIUsageBreakdown>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startTime) queryParams.append("startTime", params.startTime.toString());
      if (params?.endTime) queryParams.append("endTime", params.endTime.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<AdminApiResponse<OpenAIUsageBreakdown>>(
        `/admin/api-management/openai/detailed-usage?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch OpenAI usage breakdown",
        error: error.message,
      };
    }
  },

  /**
   * Get Gemini API Balance
   */
  async getGeminiBalance(): Promise<AdminApiResponse<APIProvider>> {
    try {
      const response = await apiClient.get<AdminApiResponse<APIProvider>>(
        "/admin/api-management/gemini/balance"
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch Gemini balance",
        error: error.message,
      };
    }
  },

  /**
   * Get Gemini API Usage
   */
  async getGeminiUsage(params?: {
    startTime?: number;
    endTime?: number;
  }): Promise<AdminApiResponse<APIUsageData>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startTime) queryParams.append("startTime", params.startTime.toString());
      if (params?.endTime) queryParams.append("endTime", params.endTime.toString());

      const response = await apiClient.get<AdminApiResponse<APIUsageData>>(
        `/admin/api-management/gemini/usage?${queryParams.toString()}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch Gemini usage",
        error: error.message,
      };
    }
  },

  /**
   * Add API Balance Credit
   */
  async addAPIBalanceCredit(
    provider: string,
    creditAmount: number,
    notes?: string
  ): Promise<AdminApiResponse<any>> {
    try {
      const response = await apiClient.post<AdminApiResponse<any>>(
        "/admin/api-management/balance/credit",
        { provider, creditAmount, notes }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add balance credit",
        error: error.message,
      };
    }
  },

  /**
   * Get API Balance History
   */
  async getAPIBalanceHistory(provider: string): Promise<AdminApiResponse<any[]>> {
    try {
      const response = await apiClient.get<AdminApiResponse<any[]>>(
        `/admin/api-management/balance/history/${provider}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch balance history",
        error: error.message,
      };
    }
  },

  /**
   * Update API Balance Credit
   */
  async updateAPIBalanceCredit(
    id: string,
    data: { creditAmount?: number; notes?: string; isActive?: boolean }
  ): Promise<AdminApiResponse<any>> {
    try {
      const response = await apiClient.put<AdminApiResponse<any>>(
        `/admin/api-management/balance/credit/${id}`,
        data
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update balance credit",
        error: error.message,
      };
    }
  },

  async deleteAPIBalanceCredit(id: string): Promise<AdminApiResponse<void>> {
    try {
      const response = await apiClient.delete<AdminApiResponse<void>>(
        `/admin/api-management/balance/credit/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete balance credit",
        error: error.message,
      };
    }
  },

  /**
   * Assign subscription plan to a user
   */
  async assignSubscription(
    userId: string,
    data: {
      planName: string;
      billingCycle: string;
      paymentStatus: string;
      invoiceNumber?: string;
    }
  ): Promise<AdminApiResponse<{ paymentUrl?: string }>> {
    try {
      // Routes to auth-service via /api/user/*
      const response = await apiClient.post<AdminApiResponse<{ paymentUrl?: string }>>(
        `/user/admin/users/${userId}/subscription/assign`,
        data
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to assign subscription",
        error: error.message,
      };
    }
  },
};
