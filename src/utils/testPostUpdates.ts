/**
 * Test utility for manually triggering post status updates
 * This is useful for testing the real-time update functionality
 */

import { emitPostStatusUpdate, emitPostRemoval } from '../utils/postStatusEvents';

/**
 * Simulate a post status change for testing
 */
export const simulatePostStatusUpdate = (postId: string, status: 'scheduled' | 'published' | 'failed' | 'cancelled', publishedAt?: string) => {
  emitPostStatusUpdate({
    postId,
    status,
    publishedAt: publishedAt || (status === 'published' ? new Date().toISOString() : undefined)
  });
};

/**
 * Simulate a post removal for testing
 */
export const simulatePostRemoval = (postId: string) => {
  emitPostRemoval({ postId });
};

/**
 * Test all status transitions for a post
 */
export const testAllStatusTransitions = (postId: string) => {
  const statuses: Array<'scheduled' | 'published' | 'failed' | 'cancelled'> = ['scheduled', 'published', 'failed', 'cancelled'];
  
  statuses.forEach((status, index) => {
    setTimeout(() => {
      simulatePostStatusUpdate(postId, status);
    }, index * 2000); // 2 seconds between each status change
  });
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testPostUpdates = {
    simulatePostStatusUpdate,
    simulatePostRemoval,
    testAllStatusTransitions
  };
}
