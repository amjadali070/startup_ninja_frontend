import { apiClient } from './apiClient';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  profilePicture?: string | null;
  department?: string;
  teamRole?: 'Admin' | 'Manager' | 'Member';
  addedBy?: string | null;
  permissions?: {
    sales: boolean;
    ops: boolean;
    finance: boolean;
    legal: boolean;
  };
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

export interface TokenUsage {
  chatTokensUsed: number;
  chatTokensLimit: number;
  chatTokensRemaining: number;
  imageGenUsed: number;
  imageGenLimit: number;
  resetInHours: number;
  periodStart: string;
  periodEnd: string;
}

export interface Subscription {
  plan: string;
  status: string;
  startDate: string;
  nextBillingDate?: string;
  amount: number;
  currency: string;
  interval: string;
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: string;
}

export const userService = {
  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await apiClient.get<UserProfileResponse>('/user/profile');
      if (response.success && response.user) {
        try {
          const storedUserRaw = localStorage.getItem('user');
          const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
          const normalizedUser = {
            ...storedUser,
            ...response.user,
            picture: response.user.profilePicture ?? storedUser?.picture ?? storedUser?.profilePicture ?? null
          };
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } catch (storageError) {
          console.error('Failed to sync profile with local storage:', storageError);
        }
      }
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
  async updateProfile(data: UpdateProfileRequest | FormData): Promise<UserProfileResponse> {
    try {
      const config = data instanceof FormData 
        ? { headers: { "Content-Type": "multipart/form-data" } } 
        : undefined;

      const response = await apiClient.put<UserProfileResponse>('/user/profile', data, config);
      
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
  },

  /**
   * Get user token usage
   */
  async getTokenUsage(): Promise<{ success: boolean; data?: TokenUsage; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: TokenUsage }>('/user/token-usage');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch token usage'
      };
    }
  },

  /**
   * Get user subscription
   */
  async getSubscription(): Promise<{ success: boolean; data?: Subscription; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Subscription }>('/user/subscription');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription'
      };
    }
  },

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<{ success: boolean; data?: UserPreferences; message?: string }> {
    try {
      const response = await apiClient.get<{ success: boolean; data: UserPreferences }>('/user/preferences');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch preferences'
      };
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(data: Partial<UserPreferences>): Promise<{ success: boolean; data?: UserPreferences; message?: string }> {
    try {
      const response = await apiClient.put<{ success: boolean; data: UserPreferences; message: string }>('/user/preferences', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update preferences'
      };
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(password?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>('/user/account', {
        data: { password }
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete account'
      };
    }
  }
};