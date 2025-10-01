import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Extend the request config interface to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

// Types for better type safety
interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: any;
  token?: string;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata?.startTime) {
          const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        }

        return response;
      },
      (error: AxiosError<ApiError>) => {
        // Log error in development
        if (import.meta.env.DEV) {
          console.error('❌ API Error:', error.response?.data || error.message);
        }

        // Handle specific HTTP status codes
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized - clear token and redirect to login
              this.handleUnauthorized();
              break;
            case 403:
              // Forbidden
              console.warn('Access forbidden - insufficient permissions');
              break;
            case 404:
              console.warn('Resource not found');
              break;
            case 422:
              // Validation error
              console.warn('Validation error:', error.response.data);
              break;
            case 429:
              // Rate limit exceeded
              console.warn('Rate limit exceeded - please slow down');
              break;
            case 500:
              // Server error
              console.error('Server error - please try again later');
              break;
            default:
              console.error('Unexpected error:', error.response.data);
          }
        } else if (error.request) {
          // Network error
          console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized(): void {
    // Clear stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch custom event for app-wide logout handling
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    // Redirect to login page if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Public methods for making requests
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Utility methods
  public setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public clearAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get the raw axios instance if needed for special cases
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Also export the class for custom instances if needed
export { ApiClient };

// Export types for use in other files
export type { ApiError, ApiResponse };