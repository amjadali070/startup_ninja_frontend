import { apiClient } from './apiClient';

export interface InstagramUser {
  id: string;
  username: string;
  account_type: 'BUSINESS' | 'CREATOR' | 'PERSONAL';
  profilePicture?: string;
  name?: string;
  media_count?: number;
  connectedAt?: string;
}

export interface InstagramConnectionStatus {
  connected: boolean;
  profile?: InstagramUser;
  message: string;
}

export interface InstagramPostResponse {
  success: boolean;
  message: string;
  data?: {
    mediaId: string;
    url: string;
  };
}

export interface InstagramDisconnectResponse {
  success: boolean;
  message: string;
}

class InstagramService {
  private readonly baseURL = '/social-media/instagram';
  private isProcessingCallback = false;

  /**
   * Initiate Instagram connection using popup OAuth flow
   */
  async initiateConnectionPopup(userId: string): Promise<{ user: InstagramUser } | null> {
    if (this.isProcessingCallback) {
      throw new Error('Instagram authentication already in progress');
    }

    try {
      this.isProcessingCallback = true;

      // Step 1: Get authorization URL from backend
      const authResponse = await apiClient.get(`${this.baseURL}/auth`, {
        params: { popup: 'true' }
      });
      
      if (!authResponse.success) {
        throw new Error(authResponse.message || 'Failed to get Instagram authorization URL');
      }

      const authUrl = authResponse.authUrl;

      // Step 2: Open popup for user authorization
      const popup = window.open(
        authUrl, 
        'instagram-auth',
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

          if (data.type === 'INSTAGRAM_OAUTH_SUCCESS') {
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
                    username: callbackResponse.profile?.username || '',
                    account_type: callbackResponse.profile?.account_type || 'PERSONAL',
                    profilePicture: callbackResponse.profile?.profilePicture || null,
                    name: callbackResponse.profile?.name || null
                  }
                });
              } else {
                reject(new Error(callbackResponse.message || 'Failed to connect Instagram account'));
              }
            } catch (error: any) {
              reject(new Error(error.message || 'Failed to complete Instagram authentication'));
            }
          } else if (data.type === 'INSTAGRAM_OAUTH_ERROR') {
            cleanup();
            popup.close();
            reject(new Error(data.error || 'Instagram authorization failed'));
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
   * Initiate Instagram connection using redirect OAuth flow (fallback)
   */
  async initiateConnection(): Promise<void> {
    try {
      // Get authorization URL from backend
      const authResponse = await apiClient.get(`${this.baseURL}/auth`, {
        params: { popup: 'false' }
      });
      
      if (!authResponse.success) {
        throw new Error(authResponse.message || 'Failed to get Instagram authorization URL');
      }

      // Redirect to Instagram authorization URL
      window.location.href = authResponse.authUrl;
    } catch (error: any) {
      throw new Error(`Failed to initiate Instagram connection: ${error.message}`);
    }
  }

  /**
   * Get Instagram connection status for a user
   */
  async getConnectionStatus(userId: string): Promise<InstagramConnectionStatus> {
    try {
      const response = await apiClient.get(`${this.baseURL}/status?userId=${userId}`);
      
      if (response.success) {
        return {
          connected: response.connected,
          profile: response.profile,
          message: response.message
        };
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      throw new Error(`Failed to get Instagram connection status: ${error.message}`);
    }
  }

  /**
   * Post content to Instagram
   */
  async postToInstagram(formData: FormData): Promise<InstagramPostResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Content posted successfully to Instagram',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to post to Instagram'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to post to Instagram'
      };
    }
  }

  /**
   * Disconnect Instagram account
   */
  async disconnectAccount(): Promise<InstagramDisconnectResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/disconnect`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Instagram account disconnected successfully'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to disconnect Instagram account'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to disconnect Instagram account'
      };
    }
  }
}

const instagramService = new InstagramService();
export default instagramService;
