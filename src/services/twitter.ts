import { apiClient } from './apiClient';

export interface TwitterUser {
  id_str: string;
  name: string;
  screen_name: string;
  profilePicture?: string;
  connectedAt?: string;
  expiresAt?: string;
}

export interface TwitterConnectionStatus {
  connected: boolean;
  profile?: TwitterUser;
  message: string;
}

export interface TwitterPostResponse {
  success: boolean;
  message: string;
  data?: {
    tweetId: string;
    url: string;
  };
}

export interface TwitterDisconnectResponse {
  success: boolean;
  message: string;
}

class TwitterService {
  private readonly baseURL = '/social-media/twitter';
  private isProcessingCallback = false;

  /**
   * Initiate Twitter connection using popup OAuth flow
   */
  async initiateConnectionPopup(userId: string): Promise<{ user: TwitterUser } | null> {
    if (this.isProcessingCallback) {
      throw new Error('Twitter authentication already in progress');
    }

    try {
      this.isProcessingCallback = true;

      // Step 1: Get request token from backend
      const requestTokenResponse = await apiClient.post(`${this.baseURL}/request-token`);
      
      if (!requestTokenResponse.success) {
        throw new Error(requestTokenResponse.message || 'Failed to get Twitter request token');
      }

      const { oauth_token, oauth_token_secret, authorize_url } = requestTokenResponse;

      // Step 2: Open popup for user authorization
      const popup = window.open(
        authorize_url, 
        'twitter-auth',
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
            oauth_token?: string; 
            oauth_verifier?: string; 
            error?: string;
          };

          if (data.type === 'TWITTER_OAUTH_SUCCESS') {
            cleanup();
            popup.close();

            try {
              // Step 3: Exchange tokens with backend
              const accessTokenResponse = await apiClient.post(`${this.baseURL}/access-token`, {
                oauth_token: data.oauth_token,
                oauth_verifier: data.oauth_verifier,
                oauth_token_secret: oauth_token_secret, // Include the token secret from step 1
                userId: userId,
                popup: 'true'
              });

              if (accessTokenResponse.success) {
                resolve({ 
                  user: {
                    id_str: accessTokenResponse.profile?.id_str || '',
                    name: accessTokenResponse.profile?.name || '',
                    screen_name: accessTokenResponse.profile?.screen_name || '',
                    profilePicture: accessTokenResponse.profile?.profilePicture || null
                  }
                });
              } else {
                reject(new Error(accessTokenResponse.message || 'Failed to connect Twitter account'));
              }
            } catch (error: any) {
              reject(new Error(error.message || 'Failed to complete Twitter authentication'));
            }
          } else if (data.type === 'TWITTER_OAUTH_ERROR') {
            cleanup();
            popup.close();
            reject(new Error(data.error || 'Twitter authorization failed'));
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
   * Initiate Twitter connection using redirect OAuth flow (fallback)
   */
  async initiateConnection(userId: string): Promise<void> {
    try {
      // Get request token from backend
      const requestTokenResponse = await apiClient.post(`${this.baseURL}/request-token`);
      
      if (!requestTokenResponse.success) {
        throw new Error(requestTokenResponse.message || 'Failed to get Twitter request token');
      }

      // Redirect to Twitter authorization URL
      window.location.href = requestTokenResponse.authorize_url;
    } catch (error: any) {
      throw new Error(`Failed to initiate Twitter connection: ${error.message}`);
    }
  }

  /**
   * Get Twitter connection status for a user
   */
  async getConnectionStatus(userId: string): Promise<TwitterConnectionStatus> {
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
      throw new Error(`Failed to get Twitter connection status: ${error.message}`);
    }
  }

  /**
   * Post content to Twitter
   */
  async postToTwitter(formData: FormData): Promise<TwitterPostResponse> {
    try {
      const response = await apiClient.post(`${this.baseURL}/post`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Tweet posted successfully',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to post tweet'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to post to Twitter'
      };
    }
  }

  /**
   * Disconnect Twitter account
   */
  async disconnectAccount(): Promise<TwitterDisconnectResponse> {
    try {
      const response = await apiClient.delete(`${this.baseURL}/disconnect`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Twitter account disconnected successfully'
        };
      } else {
        return {
          success: false,
          message: response.message || 'Failed to disconnect Twitter account'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to disconnect Twitter account'
      };
    }
  }
}

const twitterService = new TwitterService();
export default twitterService;
