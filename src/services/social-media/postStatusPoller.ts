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
  private pollInterval: number = 60000; // 60 seconds base interval
  private isPolling: boolean = false;
  private intervalId: number | null = null;
  private isChecking: boolean = false;
  private trackedPosts: Map<string, PostStatusCheck> = new Map();
  private lastKnownStatuses: Map<string, string> = new Map();

  /**
   * Start polling for status updates
   */
  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    const tick = async () => {
      if (!this.isPolling) return;
      await this.checkForUpdates();
      // Add jitter (±20%) to spread requests across clients
      const jitter = this.pollInterval * (0.8 + Math.random() * 0.4);
      this.intervalId = setTimeout(tick, jitter);
    };
    // Kick off first tick with small delay to avoid burst on mount
    this.intervalId = setTimeout(tick, 1500);
  }

  /**
   * Stop polling for status updates
   */
  stopPolling() {
    if (!this.isPolling) return;
    
    this.isPolling = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
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
    if (!this.isPolling) return;
    if (this.trackedPosts.size === 0) return;
    if (this.isChecking) return; // Prevent overlapping checks
    this.isChecking = true;

    try {
      const posts = await schedulerService.listScheduled();
      
      // Check each tracked post for status changes
      for (const [postId] of this.trackedPosts) {
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
    } catch (error: any) {
      // Backoff on 429 or network issues
      const status = error?.response?.status;
      if (status === 429) {
        // Pause polling for 2 minutes on rate limit
        this.stopPolling();
        this.intervalId = setTimeout(() => this.startPolling(), 120000);
      }
      // Swallow error to avoid crashing the app
      // console.warn('Post status polling error:', error?.message || error);
    } finally {
      this.isChecking = false;
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
