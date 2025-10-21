/**
 * Utility functions for managing post status updates in real-time
 */

export interface PostStatusUpdate {
  postId: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  publishedAt?: string;
}

export interface PostRemoval {
  postId: string;
}

/**
 * Emit a post status update event
 */
export const emitPostStatusUpdate = (update: PostStatusUpdate) => {
  window.dispatchEvent(new CustomEvent('postStatus:updated', {
    detail: update
  }));
};

/**
 * Emit a post removal event
 */
export const emitPostRemoval = (removal: PostRemoval) => {
  window.dispatchEvent(new CustomEvent('postStatus:removed', {
    detail: removal
  }));
};

/**
 * Emit a scheduled posts refresh event
 */
export const emitScheduledPostsRefresh = (data?: any) => {
  window.dispatchEvent(new CustomEvent('scheduledPosts:refresh', {
    detail: data
  }));
};

/**
 * Listen for post status updates
 */
export const onPostStatusUpdate = (callback: (update: PostStatusUpdate) => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener('postStatus:updated', handler as EventListener);
  
  return () => window.removeEventListener('postStatus:updated', handler as EventListener);
};

/**
 * Listen for post removals
 */
export const onPostRemoval = (callback: (removal: PostRemoval) => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener('postStatus:removed', handler as EventListener);
  
  return () => window.removeEventListener('postStatus:removed', handler as EventListener);
};

/**
 * Listen for scheduled posts refresh
 */
export const onScheduledPostsRefresh = (callback: (data?: any) => void) => {
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener('scheduledPosts:refresh', handler as EventListener);
  
  return () => window.removeEventListener('scheduledPosts:refresh', handler as EventListener);
};
