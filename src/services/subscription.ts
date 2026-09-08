import { apiClient } from './apiClient';

export const subscriptionService = {
  /**
   * Get user's subscription details
   */
  async getSubscription(): Promise<any> {
    try {
      const response = await apiClient.get('/user/subscription');
      return response;
    } catch (error: any) {
      console.error('Failed to fetch subscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch subscription details'
      };
    }
  },

  /**
   * Add a payment method (card)
   */
  async addPaymentMethod(cardDetails: any): Promise<any> {
    try {
      const response = await apiClient.post('/user/payment/add-card', cardDetails);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add payment method'
      };
    }
  },

  /**
   * Purchase a subscription
   */
  async purchaseSubscription(data: { 
    plan: string, 
    billingCycle: string, 
    paymentMethodId?: string 
  }): Promise<any> {
    try {
      const response = await apiClient.post('/user/payment/purchase', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to purchase subscription'
      };
    }
  },

  /**
   * Get user's saved cards
   */
  async getUserCards(): Promise<any> {
    try {
      const response = await apiClient.get('/user/payment/cards');
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch cards'
      };
    }
  },

  /**
   * Set a card as default
   */
  async setDefaultCard(cardId: string): Promise<any> {
    try {
      const response = await apiClient.put(`/user/payment/cards/${cardId}/default`, {});
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to set default card'
      };
    }
  },

  /**
   * Delete a card
   */
  async deleteCard(cardId: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/user/payment/cards/${cardId}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete card'
      };
    }
  },

  /**
   * Get transaction history
   */
  async getTransactionHistory(params?: { 
    limit?: number, 
    skip?: number, 
    status?: string, 
    type?: string 
  }): Promise<any> {
    try {
      const response = await apiClient.get('/user/payment/transactions', { params });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch transaction history'
      };
    }
  },

  /**
   * Cancel Subscription
   */
  async cancelSubscription(): Promise<any> {
    try {
      const response = await apiClient.post('/user/payment/cancel-subscription', {});
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel subscription'
      };
    }
  },

  /**
   * Get a single transaction
   */
  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/user/payment/transactions/${transactionId}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch transaction'
      };
    }
  },

  /**
   * Schedule a downgrade to take effect at the end of the current billing
   * period (mirrors cancelSubscription's cancel-at-period-end approach).
   */
  async scheduleDowngrade(plan: string): Promise<any> {
    try {
      const response = await apiClient.post('/user/payment/downgrade-subscription', { plan });
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to schedule downgrade'
      };
    }
  },

  /**
   * Cancel a previously scheduled downgrade
   */
  async cancelScheduledDowngrade(): Promise<any> {
    try {
      const response = await apiClient.post('/user/payment/cancel-downgrade', {});
      return response;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel scheduled downgrade'
      };
    }
  }
};
