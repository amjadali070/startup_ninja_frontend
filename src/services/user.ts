import { apiClient } from './apiClient';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export const userService = {
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>('/user/profile');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
        errors: error.response?.data?.errors
      };
    }
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.put<UserProfileResponse>('/user/profile', data);
      
      // Update local storage if successful
      if (response.success && response.user) {
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          const updatedUser = { ...userData, ...response.user };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile',
        errors: error.response?.data?.errors
      };
    }
  }
};