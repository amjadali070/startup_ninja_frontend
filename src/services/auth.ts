import { apiClient } from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthPayload, MicrosoftAuthPayload, LogoutResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data if login successful
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error: any) {
      // Return standardized error response
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed', 
        errors: error.response?.data?.errors
      };
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Store token and user data if registration successful
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error: any) {
      // Return standardized error response
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors
      };
    }
  },

  async googleLogin(payload: GoogleAuthPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', payload);

      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google authentication failed',
        errors: error.response?.data?.errors
      };
    }
  },

  async logout(userData: { user: { userId: string } }): Promise<LogoutResponse> {
    try {
      const response = await apiClient.post<LogoutResponse>('/auth/logout', userData);
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Logout failed';
      return {
        success: false,
        message
      };
    } finally {
      apiClient.clearAuthToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async microsoftLogin(payload: MicrosoftAuthPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/microsoft', payload);

      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Microsoft authentication failed',
        errors: error.response?.data?.errors
      };
    }
  },

  async verifyEmail(userId: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', {
        userId,
        otp
      });
      
      // Store token and user data if verification successful
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
        errors: error.response?.data?.errors
      };
    }
  },

  async resendOTP(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/resend-otp', {
        userId
      });
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend OTP'
      };
    }
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return apiClient.isAuthenticated();
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/change-password', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send password reset email'
      };
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { 
        token, 
        newPassword 
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
};
