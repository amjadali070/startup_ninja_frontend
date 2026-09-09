import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { schedulerService, type ScheduledPostItem } from '../../services/scheduler';
import notificationsService, { type NotificationItem } from '../../services/notifications';
import PostDetailsView from '../../components/social-media/PostDetailsView';
import { useAuth } from '../../hooks/useAuth';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [post, setPost] = useState<ScheduledPostItem | null>(null);
  const [relatedNotification, setRelatedNotification] = useState<NotificationItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setError(null);
    (async () => {
      try {
        const res = await schedulerService.getById(id);
        if (res.success && res.data) {
          setPost(res.data);
        } else {
          setError((res as any).message || 'This post could not be found.');
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load this post.');
      }
      // Fetch notifications and find the one linked to this post (by metadata.scheduledPostId)
      try {
        const nres = await notificationsService.list(1, 50);
        if (nres.success && Array.isArray(nres.data)) {
          const match = nres.data.find((n: any) => (n as any)?.metadata?.scheduledPostId === id);
          if (match) setRelatedNotification(match as NotificationItem);
        }
      } catch (_) {}
    })();
  }, [id]);

  const handleLogout = async () => {
    try { await logout(); } finally { navigate('/login', { replace: true }); }
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/social-pro"
      title="Post Details"
      onLogout={handleLogout}
      onSettings={() => navigate('/settings')}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4">
          <div className="w-full max-w-auto mx-auto space-y-4">
            {relatedNotification && (
              
              <div className="bg-[#151515] border border-white/10 rounded-xl p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-md">{relatedNotification.title}</div>
                </div>
                <div className="text-white font-semibold text-sm">Post Publish Method:</div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider 
                  ${relatedNotification.type === 'success' || relatedNotification.type === 'published' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : ''}
                  ${relatedNotification.type === 'warning' || relatedNotification.type === 'scheduled' ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30' : ''}
                  ${relatedNotification.type === 'error' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30' : ''}
                  ${relatedNotification.type === 'info' ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/30' : ''}
                `}>
                  {relatedNotification.type}
                </div>
                
              </div>
            )}
            {error ? (
              <div className="bg-[#151515] border border-white/10 rounded-xl p-8 text-center">
                <div className="text-white font-semibold mb-1">Couldn't load this post</div>
                <div className="text-white/50 text-sm">{error}</div>
              </div>
            ) : (
              <PostDetailsView post={post as any} />
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}


