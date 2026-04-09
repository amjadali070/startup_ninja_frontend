import { apiClient } from './apiClient';

export interface TeamMember {
  _id: string;
  fullname: string;
  email: string;
  role: string;
  status: number;
  department: string;
  teamRole: string;
  permissions: {
    sales: boolean;
    ops: boolean;
    finance: boolean;
    legal: boolean;
  };
  createdBy?: {
    _id: string;
    fullname: string;
    email: string;
    teamRole: string;
  };
}

export interface TeamMemberResponse {
  success: boolean;
  message?: string;
  data?: TeamMember;
}

export interface TeamMembersResponse {
  success: boolean;
  message?: string;
  data?: TeamMember[];
}

// Ensure the endpoint hits the admin-service which runs on PORT 3002 usually by default,
// or via API Gateway. If API gateway is configured for /admin prefix, we might need to adjust.
// We'll use /team as registered in admin-service index.js. 
// However, the proxy setup in frontend determines the base URL. If the proxy only points to API gateway, we need to prefix properly.
// The apiClient usually has the base API url. If admin-service is not exposed directly via standard API path, this might require a custom axios instance or prefix.
// Assuming API Gateway routes /api/team to admin-service, or the frontend proxies it.
// Wait, looking at admin-service/src/index.js, it registers app.use('/team', teamRoutes).
// Usually API gateway rewrites /api/team to /team on admin service. 
export const teamService = {
  async getMembers(): Promise<TeamMembersResponse> {
    try {
      const response = await apiClient.get<TeamMembersResponse>('/admin/team/members');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch team members'
      };
    }
  },

  async addMember(data: any): Promise<TeamMemberResponse> {
    try {
      const response = await apiClient.post<TeamMemberResponse>('/admin/team/members', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add team member'
      };
    }
  },

  async updateMember(id: string, data: any): Promise<TeamMemberResponse> {
    try {
      const response = await apiClient.put<TeamMemberResponse>(`/admin/team/members/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update team member'
      };
    }
  },

  async deleteMember(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`/admin/team/members/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete team member'
      };
    }
  },

  async resetMemberPassword(id: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(`/admin/team/members/${id}/reset-password`, { password });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
};
