import { apiClient } from './apiClient';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

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

  logout() {
    apiClient.clearAuthToken();
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return apiClient.isAuthenticated();
  }
};
