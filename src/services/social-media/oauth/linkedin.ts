import { apiClient } from '../../apiClient';

export interface LinkedInProfile {
  name: string;
  email: string;
  profilePicture?: string;
  connectedAt: string;
  expiresAt: string;
}

export interface LinkedInConnectionStatus {
  connected: boolean;
  profile?: LinkedInProfile;
  message: string;
}

export interface LinkedInPostResponse {
  success: boolean;
  message: string;
  data?: {
    postId: string;
    postUrl: string;
  };
  requiresReconnection?: boolean;
}

class LinkedInService {
  private baseURL = '/social-media/linkedin';

  /**
   * Get LinkedIn OAuth authorization URL
   */
  async getAuthUrl(userId: string): Promise<{ authUrl: string; state: string }> {
    try {
      const response = await apiClient.get(`${this.baseURL}/auth`, {
        params: { userId }
      });
      
      if (response.success) {
        return {
          authUrl: response.authUrl,
          state: response.state
        };
      }
      
      throw new Error(response.message || 'Failed to get LinkedIn auth URL');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initiate LinkedIn authentication');
    }
  }

  /**
   * Get LinkedIn connection status for the current user
   */
  async getConnectionStatus(userId?: string): Promise<LinkedInConnectionStatus> {
    try {
      // Build query params - include userId if provided
      const params: any = {};
      if (userId) {
        params.userId = userId;
      }
      
      const response = await apiClient.get(`${this.baseURL}/status`, {
        params: Object.keys(params).length > 0 ? params : undefined
      });
      
      if (response.success) {
        return {
          connected: response.connected,
          profile: response.profile,
          message: response.message
        };
      }
      
      throw new Error(response.message || 'Failed to get connection status');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to check LinkedIn connection status');
    }
  }

  /**
   * Post content to LinkedIn
   */
  async postToLinkedIn(formData: FormData): Promise<LinkedInPostResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: response.success,
        message: response.message,
        data: response.data,
        requiresReconnection: response.requiresReconnection
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to post to LinkedIn';
      const requiresReconnection = error.response?.data?.requiresReconnection || false;
      
      return {
        success: false,
        message: errorMessage,
        requiresReconnection
      };
    }
  }

  /**
   * Disconnect LinkedIn account
   */
  async disconnectAccount(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/disconnect`);
      
      return {
        success: response.success,
        message: response.message
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to disconnect LinkedIn account');
    }
  }

  /**
   * Initiate LinkedIn connection using popup window (like demo)
   */
  async initiateConnectionPopup(userId: string): Promise<{ user: any; accessToken: string } | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await apiClient.get(`${this.baseURL}/auth`, {
          params: { userId, popup: 'true' }
        });
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to get LinkedIn auth URL');
        }
        
        const popup = window.open(
          response.authUrl,
          'linkedin-login',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          throw new Error('Failed to open popup window. Please allow popups for this site.');
        }

        const messageHandler = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            popup.close();

            try {
              const { code, state } = event.data;
              
              // Mark that we're processing callback to prevent popup close timeout
              isProcessingCallback = true;
              
              // Process the OAuth callback through our backend
              const callbackResponse = await apiClient.get(`${this.baseURL}/callback`, {
                params: { code, state, popup: 'true' }
              });
              
              if (callbackResponse.success) {
                const resolveData = {
                  user: callbackResponse.profile || {},
                  accessToken: 'stored_securely_in_backend'
                };
                resolve(resolveData);
                return; // Ensure we exit after resolving
              } else {
                throw new Error(callbackResponse.message || 'OAuth callback failed');
              }
            } catch (error) {
              reject(error);
            }
          } else if (event.data.type === 'LINKEDIN_AUTH_ERROR') {
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error || 'LinkedIn authentication failed'));
          }
        };

        window.addEventListener('message', messageHandler);

        // Check if popup was closed manually
        let isResolved = false;
        let isProcessingCallback = false;
        let checkClosed: number;
        
        const originalResolve = resolve;
        resolve = (value) => {
          if (!isResolved) {
            isResolved = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            originalResolve(value);
          }
        };

        checkClosed = setInterval(() => {
          if (popup.closed && !isResolved && !isProcessingCallback) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            resolve(null); // User cancelled
          }
        }, 1000);

      } catch (error: any) {
        reject(error);
      }
    });
  }

  /**
   * Redirect user to LinkedIn for authentication (fallback method)
   */
  async initiateConnection(userId: string): Promise<void> {
    try {
      const { authUrl } = await this.getAuthUrl(userId);
      
      // Redirect to LinkedIn auth URL directly
      // LinkedIn will redirect back to our backend callback URL
      // which will then redirect to frontend with success/error params
      window.location.href = authUrl;
    } catch (error) {
      throw error;
    }
  }
}

export default new LinkedInService();
