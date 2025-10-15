import { apiClient } from './apiClient';

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  profilePicture?: string;
}

export interface FacebookPage {
  id: string;
  name: string;
  category: string;
  picture?: string;
}

export interface FacebookConnectionStatus {
  connected: boolean;
  profile?: FacebookUser;
  pages?: FacebookPage[];
  message: string;
}

export interface FacebookPostResponse {
  success: boolean;
  message: string;
  data?: {
    postId: string;
    pageId: string;
    pageName: string;
  };
}

export interface FacebookDisconnectResponse {
  success: boolean;
  message: string;
}

class FacebookService {
  private readonly baseURL = '/social-media/facebook';
  private isProcessingCallback = false;

  /**
   * Initiate Facebook connection using popup OAuth flow
   */
  async initiateConnectionPopup(userId: string): Promise<{ user: FacebookUser; pages: FacebookPage[] } | null> {
    if (this.isProcessingCallback) {
      throw new Error('Facebook authentication already in progress');
    }

    try {
      this.isProcessingCallback = true;

      // Step 1: Get authorization URL from backend
      const authResponse = await apiClient.get(`${this.baseURL}/auth`, {
        params: { popup: 'true' }
      });

      if (!authResponse.success) {
        throw new Error(authResponse.message || 'Failed to get Facebook authorization URL');
      }

      const authUrl = authResponse.authUrl;

      // Step 2: Open popup for user authorization
      const popup = window.open(
        authUrl, 
        'facebook-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      return new Promise((resolve, reject) => {
        let checkClosed: number;

        const cleanup = () => {
          if (checkClosed) clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          this.isProcessingCallback = false;
        };

        // Check if popup was closed manually
        checkClosed = window.setInterval(() => {
          if (popup.closed) {
            cleanup();
            if (!this.isProcessingCallback) {
              resolve(null); // User cancelled
            }
          }
        }, 1000) as unknown as number;

        // Listen for messages from popup
        const messageHandler = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          const data = event.data as { 
            type: string; 
            code?: string; 
            error?: string;
          };

          if (data.type === 'FACEBOOK_OAUTH_SUCCESS') {
            cleanup();
            popup.close();

            try {
              // Step 3: Exchange code for access token via backend
              const callbackResponse = await apiClient.post(`${this.baseURL}/callback`, {
                code: data.code,
                userId: userId,
                popup: 'true'
              });

              if (callbackResponse.success) {
                resolve({ 
                  user: {
                    id: callbackResponse.profile?.id || '',
                    name: callbackResponse.profile?.name || '',
                    email: callbackResponse.profile?.email || '',
                    profilePicture: callbackResponse.profile?.profilePicture || null
                  },
                  pages: callbackResponse.pages || []
                });
              } else {
                reject(new Error(callbackResponse.message || 'Failed to connect Facebook account'));
              }
            } catch (error: any) {
              reject(new Error(error.message || 'Failed to complete Facebook authentication'));
            }
          } else if (data.type === 'FACEBOOK_OAUTH_ERROR') {
            cleanup();
            popup.close();
            reject(new Error(data.error || 'Facebook authorization failed'));
          }
        };

        window.addEventListener('message', messageHandler);
      });
    } catch (error: any) {
      this.isProcessingCallback = false;
      throw error;
    }
  }

  /**
   * Initiate Facebook connection using redirect OAuth flow (fallback)
   */
  async initiateConnection(): Promise<void> {
    try {
      // Get authorization URL from backend
      const authResponse = await apiClient.get(`${this.baseURL}/auth`, {
        params: { popup: 'false' }
      });
      
      if (!authResponse.success) {
        throw new Error(authResponse.message || 'Failed to get Facebook authorization URL');
      }

      // Redirect to Facebook authorization URL
      window.location.href = authResponse.authUrl;
    } catch (error: any) {
      throw new Error(`Failed to initiate Facebook connection: ${error.message}`);
    }
  }

  /**
   * Get Facebook connection status for a user
   */
  async getConnectionStatus(userId: string): Promise<FacebookConnectionStatus> {
    try {
      const response = await apiClient.get(`${this.baseURL}/status?userId=${userId}`);
      
      if (response.success) {
        return {
          connected: response.connected,
          profile: response.profile,
          pages: response.pages,
          message: response.message
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      throw new Error(`Failed to get Facebook connection status: ${error.message}`);
    }
  }

  /**
   * Post content to Facebook
   */
  async postToFacebook(formData: FormData): Promise<FacebookPostResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Content posted successfully to Facebook',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to post to Facebook'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to post to Facebook'
      };
    }
  }

  /**
   * Disconnect Facebook account
   */
  async disconnectAccount(): Promise<FacebookDisconnectResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/disconnect`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Facebook account disconnected successfully'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to disconnect Facebook account'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to disconnect Facebook account'
      };
    }
  }
}

const facebookService = new FacebookService();
export default facebookService;
