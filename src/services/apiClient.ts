import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Extend the request config interface to include metadata
declare module "axios" {
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
  private csrfToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 150000, // 2.5 minutes timeout for social media posts
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, // Enable cookies for CSRF and session management
    });

    this.setupInterceptors();
    this.initializeCsrfToken();
  }

  private async initializeCsrfToken(): Promise<void> {
    try {
      const response = await this.axiosInstance.get("/csrf-token");
      this.csrfToken = response.data.csrfToken;
      if (import.meta.env.DEV) {
        console.log("🔒 CSRF token initialized");
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  }

  private async refreshCsrfToken(): Promise<void> {
    await this.initializeCsrfToken();
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

        // Add CSRF token for state-changing requests
        if (
          this.csrfToken &&
          ["post", "put", "patch", "delete"].includes(
            config.method?.toLowerCase() || ""
          )
        ) {
          config.headers["X-CSRF-Token"] = this.csrfToken;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        // Log request in development
        if (import.meta.env.DEV) {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
          );
        }

        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in development
        if (import.meta.env.DEV && response.config.metadata?.startTime) {
          const duration =
            new Date().getTime() - response.config.metadata.startTime.getTime();
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${
              response.config.url
            } (${duration}ms)`
          );
        }

        return response;
      },
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Log error in development
        if (import.meta.env.DEV) {
          console.error("❌ API Error:", error.response?.data || error.message);
        }

        // Handle specific HTTP status codes
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Skip token refresh for auth endpoints (login, register, etc.)
              const isAuthEndpoint =
                originalRequest.url?.includes("/auth/login") ||
                originalRequest.url?.includes("/auth/register") ||
                originalRequest.url?.includes("/auth/verify-email") ||
                originalRequest.url?.includes("/auth/google") ||
                originalRequest.url?.includes("/auth/microsoft");

              if (isAuthEndpoint) {
                // Just reject the error for auth endpoints - don't try to refresh
                return Promise.reject(error);
              }

              // Unauthorized - try to refresh token
              if (!originalRequest._retry) {
                originalRequest._retry = true;

                if (this.isRefreshing) {
                  // Wait for the refresh to complete
                  return new Promise((resolve) => {
                    this.refreshSubscribers.push((token: string) => {
                      if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                      }
                      resolve(this.axiosInstance(originalRequest));
                    });
                  });
                }

                this.isRefreshing = true;

                try {
                  const refreshToken = localStorage.getItem("refreshToken");
                  if (refreshToken) {
                    const response = await this.axiosInstance.post(
                      "/auth/refresh-token",
                      {
                        refreshToken,
                      }
                    );

                    const { token: newToken, refreshToken: newRefreshToken } =
                      response.data;
                    this.setAuthToken(newToken);
                    localStorage.setItem("refreshToken", newRefreshToken);

                    // Notify all subscribers
                    this.refreshSubscribers.forEach((callback) =>
                      callback(newToken)
                    );
                    this.refreshSubscribers = [];

                    if (originalRequest.headers) {
                      originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }

                    return this.axiosInstance(originalRequest);
                  }
                } catch (refreshError) {
                  // Refresh failed - clear tokens and notify user
                  this.clearAuthToken();
                  localStorage.removeItem("refreshToken");
                  
                  // Dispatch session expired event for the modal
                  window.dispatchEvent(new Event("session-expired"));
                  
                  // Optional: still reject so the calling code knows it failed
                  return Promise.reject(refreshError);
                } finally {
                  this.isRefreshing = false;
                }
              }

              // If retry failed, clear tokens and redirect
              this.clearAuthToken();
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
              break;
            case 403:
              // Forbidden - might be CSRF token issue
              if (error.response.data?.message?.includes("CSRF")) {
                await this.refreshCsrfToken();
                if (!originalRequest._retry) {
                  originalRequest._retry = true;
                  return this.axiosInstance(originalRequest);
                }
              }
              console.warn("Access forbidden - insufficient permissions");
              break;
            case 404:
              console.warn("Resource not found");
              break;
            case 422:
              // Validation error
              console.warn("Validation error:", error.response.data);
              break;
            case 423:
              // Account locked
              console.error("Account locked:", error.response.data);
              break;
            case 429:
              // Rate limit exceeded
              console.warn("Rate limit exceeded - please slow down");
              break;
            case 500:
              // Server error
              console.error("Server error - please try again later");
              break;
            default:
              console.error("Unexpected error:", error.response.data);
          }
        } else if (error.request) {
          // Network error
          console.error("Network error - please check your connection");
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Public methods for making requests
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Utility methods
  public setAuthToken(token: string): void {
    localStorage.setItem("token", token);
  }

  public clearAuthToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
