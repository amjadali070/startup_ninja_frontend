import { apiClient } from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest, GoogleAuthPayload, MicrosoftAuthPayload, LogoutResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store token and user data if login successful
      if (response.success && response.token) {
        apiClient.setAuthToken(response.token);
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

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await apiClient.post<LogoutResponse>('/auth/logout', {});
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

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return apiClient.isAuthenticated();
  }
};
