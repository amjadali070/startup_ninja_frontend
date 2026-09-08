import { apiClient } from './apiClient';

export interface StudentVerificationStatus {
  status: 'none' | 'pending' | 'approved' | 'rejected' | 'expired';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
}

export interface StudentVerificationSubmission {
  _id: string;
  userId: { _id: string; fullname: string; username: string; email: string };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export const studentVerificationService = {
  async getMyStatus(): Promise<any> {
    try {
      const response = await apiClient.get('/user/student-verification');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch verification status',
      };
    }
  },

  async submitVerification(idImage: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('idImage', idImage);
      const response = await apiClient.post('/user/student-verification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit verification',
      };
    }
  },

  // Admin
  async listVerifications(status: string = 'pending'): Promise<any> {
    try {
      const response = await apiClient.get('/user/admin/student-verifications', { params: { status } });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch verifications',
      };
    }
  },

  async getVerificationImageBlob(id: string): Promise<Blob | null> {
    try {
      const axiosInstance = apiClient.getAxiosInstance();
      const response = await axiosInstance.get(`/user/admin/student-verifications/${id}/image`, {
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      console.error('Failed to fetch verification image:', error);
      return null;
    }
  },

  async approveVerification(id: string): Promise<any> {
    try {
      const response = await apiClient.post(`/user/admin/student-verifications/${id}/approve`, {});
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to approve verification',
      };
    }
  },

  async rejectVerification(id: string, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post(`/user/admin/student-verifications/${id}/reject`, { reason });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject verification',
      };
    }
  },
};
