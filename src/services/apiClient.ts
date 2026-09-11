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
  private clientIp: string | null = null;
  private clientIpPromise: Promise<string | null> | null = null;

  constructor() {
    // A relative path (not an absolute http://localhost:5000/api) so the browser's requests
    // stay same-origin against the frontend dev server, which proxies /api to the gateway
    // itself (see vite.config.ts). An absolute cross-origin URL here previously made every
    // request cross-*scheme* too (this dev server is https, the gateway plain http) — Chrome's
    // Schemeful-SameSite policy treats that as cross-site and silently refuses to store the
    // SameSite=Lax CSRF cookie, breaking every state-changing request with no visible cause
    // beyond a 403 that looked like a CSRF bug rather than a networking one.
    this.baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

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
      async (config) => {
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

        // Attach client IP header (best effort)
        await this.addClientIpHeader(config);

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };



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
          // Several backend services (api-gateway, auth-service, and others behind it) verify
          // the JWT with jwt.verify() and respond 403 "Invalid or expired token" on failure —
          // including the *expired* case, not just malformed tokens. HTTP-wise that should be
          // 401 (403 is meant for "authenticated but not allowed"), but until every service is
          // aligned, treating a 403 with this signature the same as a 401 here is what actually
          // makes the refresh-token flow below fire on real expiry. Without this, an expired
          // access token silently 403s forever: no refresh attempt, no "session expired"
          // modal, no redirect — every request on the page just fails quietly.
          const responseMessage = error.response.data?.message || "";
          const isExpiredOrInvalidToken =
            error.response.status === 401 ||
            (error.response.status === 403 &&
              /invalid|expired/i.test(responseMessage) &&
              !/csrf/i.test(responseMessage));

          if (isExpiredOrInvalidToken) {
              // Skip token refresh for auth endpoints (login, register, etc.)
              const isAuthEndpoint =
                originalRequest.url?.includes("/auth/login") ||
                originalRequest.url?.includes("/auth/register") ||
                originalRequest.url?.includes("/auth/verify-email") ||
                originalRequest.url?.includes("/auth/google") ||
                originalRequest.url?.includes("/auth/microsoft") ||
                originalRequest.url?.includes("/auth/refresh-token");

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
                  const refreshToken = localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
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
                    // Same storage this refreshToken was actually read from
                    // above (localStorage checked first, matching every
                    // other read of this value) — writing it back to
                    // sessionStorage-first instead, as this used to, could
                    // silently update the storage nothing reads from first,
                    // leaving the value future requests actually use stale.
                    if (localStorage.getItem("refreshToken")) {
                      localStorage.setItem("refreshToken", newRefreshToken);
                    } else {
                      sessionStorage.setItem("refreshToken", newRefreshToken);
                    }

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

                  // No refresh token stored at all - genuinely nothing left to recover
                  // the session with, so this really is the end of it.
                  this.clearAuthToken();
                  localStorage.removeItem("refreshToken");
                  sessionStorage.removeItem("refreshToken");
                  window.dispatchEvent(new Event("session-expired"));
                  return Promise.reject(error);
                } catch (refreshError) {
                  // The refresh call itself failed, meaning the refresh token is genuinely
                  // dead (rejected by the backend) - this is the one case that legitimately
                  // means the session is over. Clear tokens and notify user.
                  this.clearAuthToken();
                  localStorage.removeItem("refreshToken");
                  sessionStorage.removeItem("refreshToken");

                  // Dispatch session expired event for the modal
                  window.dispatchEvent(new Event("session-expired"));

                  // Optional: still reject so the calling code knows it failed
                  return Promise.reject(refreshError);
                } finally {
                  this.isRefreshing = false;
                }
              }

              // Reaching here means this exact request already went through one
              // refresh-and-retry cycle (originalRequest._retry was already true) and failed
              // again. The only ways to get here are: this request was itself the refresher
              // and its own post-refresh retry failed, or it was queued behind another
              // request's refresh (via refreshSubscribers) and got notified with a fresh token
              // whose own retry then failed - either way a refresh had already SUCCEEDED (a
              // failed refresh is handled entirely by the catch block above, which never
              // reaches here). So the refresh token is known-good at this point, and this
              // second failure on one specific request is not proof the whole session is
              // dead - it can just as easily be an unrelated, transient problem (a slow/flaky
              // backend, a one-off 5xx-then-401 from a proxy, a CSRF hiccup on this one call).
              // Previously this branch unconditionally cleared BOTH tokens and hard-redirected
              // every open tab to /login - logging the user out of an otherwise perfectly
              // healthy, just-renewed session over one unrelated request's bad luck (verified:
              // forcing a single unrelated 401 on a post-refresh retry reproduced exactly that,
              // with a still-valid refresh token in storage getting wiped). Only reject this
              // one request and let its own caller handle the error (e.g. show a toast) -
              // don't touch the session.
              return Promise.reject(error);
          } else {
            switch (error.response.status) {
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
          }
        } else if (error.request) {
          // Network error
          console.error("Network error - please check your connection");
        }

        return Promise.reject(error);
      }
    );
  }

  private getCachedClientIp(): string | null {
    if (this.clientIp) return this.clientIp;
    if (typeof window === "undefined") return null;
    try {
      const stored = window.sessionStorage?.getItem("client-ip");
      if (stored) {
        this.clientIp = stored;
        return stored;
      }
    } catch (error) {
      // Ignore storage errors (private mode, etc.)
    }
    return null;
  }

  private cacheClientIp(ip: string) {
    this.clientIp = ip;
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage?.setItem("client-ip", ip);
    } catch (error) {
      // Ignore storage errors
    }
  }

  private async resolveClientIp(): Promise<string | null> {
    const cached = this.getCachedClientIp();
    if (cached) {
      return cached;
    }

    if (typeof window === "undefined") {
      return null;
    }

    if (!this.clientIpPromise) {
      this.clientIpPromise = fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          if (data?.ip) {
            this.cacheClientIp(data.ip);
            return data.ip;
          }
          return null;
        })
        .catch(() => null)
        .finally(() => {
          this.clientIpPromise = null;
        });
    }

    const ip = await this.clientIpPromise;
    if (ip) {
      this.cacheClientIp(ip);
    }
    return ip;
  }

  private async addClientIpHeader(config: AxiosRequestConfig): Promise<void> {
    try {
      const ip = await this.resolveClientIp();
      if (ip) {
        config.headers = config.headers || {};
        config.headers["X-User-IP"] = ip;
      }
    } catch (error) {
      // Silent fail – IP header is best-effort only
    }
  }

  private getToken(): string | null {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
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
    // localStorage checked first here too, matching getToken()'s own read
    // priority below — kept consistent so a write always lands in the same
    // storage a subsequent read will actually look in first.
    if (localStorage.getItem("token")) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
  }

  public clearAuthToken(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
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
