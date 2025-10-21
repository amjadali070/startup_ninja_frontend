/**
 * Service for polling post status updates
 * This simulates real-time updates by periodically checking for status changes
 */

import schedulerService from './scheduler';

export interface PostStatusCheck {
  postId: string;
  lastChecked: number;
}

class PostStatusPoller {
  private pollInterval: number = 30000; // 30 seconds
  private isPolling: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private trackedPosts: Map<string, PostStatusCheck> = new Map();
  private lastKnownStatuses: Map<string, string> = new Map();

  /**
   * Start polling for status updates
   */
  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.intervalId = setInterval(() => {
      this.checkForUpdates();
    }, this.pollInterval);
  }

  /**
   * Stop polling for status updates
   */
  stopPolling() {
    if (!this.isPolling) return;
    
    this.isPolling = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Add a post to track for status updates
   */
  trackPost(postId: string) {
    this.trackedPosts.set(postId, {
      postId,
      lastChecked: Date.now()
    });
    
    // Start polling if not already started
    if (!this.isPolling) {
      this.startPolling();
    }
  }

  /**
   * Remove a post from tracking
   */
  untrackPost(postId: string) {
    this.trackedPosts.delete(postId);
    this.lastKnownStatuses.delete(postId);
    
    // Stop polling if no posts are being tracked
    if (this.trackedPosts.size === 0) {
      this.stopPolling();
    }
  }

  /**
   * Track multiple posts at once
   */
  trackPosts(postIds: string[]) {
    postIds.forEach(postId => this.trackPost(postId));
  }

  /**
   * Check for status updates
   */
  private async checkForUpdates() {
    if (this.trackedPosts.size === 0) return;

    try {
      const posts = await schedulerService.listScheduled();
      
      // Check each tracked post for status changes
      for (const [postId, check] of this.trackedPosts) {
        const currentPost = posts.find(p => p._id === postId);
        
        if (currentPost) {
          const lastKnownStatus = this.lastKnownStatuses.get(postId);
          const currentStatus = currentPost.status;
          
          // If status has changed, emit update event
          if (lastKnownStatus && lastKnownStatus !== currentStatus) {
            this.emitStatusUpdate(postId, currentStatus, currentPost.publishedAt);
          }
          
          // Update last known status
          this.lastKnownStatuses.set(postId, currentStatus);
        } else {
          // Post no longer exists, emit removal event
          this.emitPostRemoval(postId);
          this.untrackPost(postId);
        }
      }
    } catch (error) {
      console.error('Error checking for post status updates:', error);
    }
  }

  /**
   * Emit status update event
   */
  private emitStatusUpdate(postId: string, status: string, publishedAt?: string) {
    window.dispatchEvent(new CustomEvent('postStatus:updated', {
      detail: { postId, status, publishedAt }
    }));
  }

  /**
   * Emit post removal event
   */
  private emitPostRemoval(postId: string) {
    window.dispatchEvent(new CustomEvent('postStatus:removed', {
      detail: { postId }
    }));
  }

  /**
   * Get currently tracked posts
   */
  getTrackedPosts(): string[] {
    return Array.from(this.trackedPosts.keys());
  }

  /**
   * Clear all tracked posts
   */
  clearTrackedPosts() {
    this.trackedPosts.clear();
    this.lastKnownStatuses.clear();
    this.stopPolling();
  }
}

// Export singleton instance
export const postStatusPoller = new PostStatusPoller();

// Auto-start polling when the service is imported
// This ensures status updates are checked even if components don't explicitly start polling
postStatusPoller.startPolling();
