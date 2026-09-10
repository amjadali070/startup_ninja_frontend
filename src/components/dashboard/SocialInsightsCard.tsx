import { useState, useEffect, type FC } from "react";
import { FiFacebook, FiInstagram, FiLinkedin, FiGlobe, FiClock, FiCheck } from "react-icons/fi";
import { RiOrganizationChart, RiTwitterXFill } from "react-icons/ri";
import { useAuth } from "../../hooks/useAuth.tsx";
import facebookService from "../../services/social-media/oauth/facebook";
import instagramService from "../../services/social-media/oauth/instagram";
import linkedinService from "../../services/social-media/oauth/linkedin";
import twitterService from "../../services/social-media/oauth/twitter";
import schedulerService from "../../services/social-media/scheduler";

interface PostSummary {
  id: string;
  caption: string;
  platforms: string[];
  status: "scheduled" | "published" | "failed" | "cancelled";
  scheduledAt?: string;
  publishedAt?: string;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "facebook": return <FiFacebook className="h-3.5 w-3.5 text-[#1877F2]" />;
    case "instagram": return <FiInstagram className="h-3.5 w-3.5 text-[#E4405F]" />;
    case "linkedin": return <FiLinkedin className="h-3.5 w-3.5 text-[#0A66C2]" />;
    case "twitter": 
    case "x": 
      return <RiTwitterXFill className="h-3.5 w-3.5 text-white" />;
    default: return <FiGlobe className="h-3.5 w-3.5 text-white/40" />;
  }
};

const getRelativeTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const SocialInsightsCard: FC = () => {
  const { user } = useAuth();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [totalPosted, setTotalPosted] = useState(0);
  const [totalScheduled, setTotalScheduled] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch connected accounts across all platforms
        if (user?.id) {
          try {
            const [fb, ig, li, tw] = await Promise.allSettled([
              facebookService.getConnectionStatus(user.id),
              instagramService.getConnectionStatus(user.id),
              linkedinService.getConnectionStatus(user.id),
              twitterService.getConnectionStatus(user.id)
            ]);
            
            const activePlatforms: string[] = [];
            if (fb.status === 'fulfilled' && fb.value.connected) activePlatforms.push('facebook');
            if (ig.status === 'fulfilled' && ig.value.connected) activePlatforms.push('instagram');
            if (li.status === 'fulfilled' && li.value.connected) activePlatforms.push('linkedin');
            if (tw.status === 'fulfilled' && tw.value.connected) activePlatforms.push('twitter');
            setConnectedPlatforms(activePlatforms);
          } catch (err) {
            console.error("Error checking social status", err);
          }
        }

        // Fetch posts
        try {
          const posts = await schedulerService.listScheduled();
          const mapped: PostSummary[] = (posts || []).map((p: any) => ({
            id: p._id,
            caption: p.caption || "",
            platforms: p.platforms || [],
            status: p.status,
            scheduledAt: p.scheduledAt,
            publishedAt: p.publishedAt,
          }));

          // Counts
          setTotalPosted(mapped.filter((p) => p.status === "published").length);
          setTotalScheduled(mapped.filter((p) => p.status === "scheduled").length);

          // Recent 5 posts (by most recently created)
          setRecentPosts(mapped.slice(0, 5));
        } catch {
          // no posts
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);



  return (
    <div className="group relative h-full w-full">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full w-full flex-col rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#2A2A2A] group-hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3B3B]/20 to-[#B91C1C]/10 sm:h-9 sm:w-9">
              <RiOrganizationChart className="h-5 w-5 text-[#FF3B3B] sm:h-6 sm:w-6" />
            </div>
            <h2 className="font-plus-jakarta text-base font-bold text-white sm:text-lg">
              Social Media
            </h2>
          </div>

          {/* Active Platform Statuses in Header */}
          <div className="flex items-center gap-1.5">
            {connectedPlatforms.length > 0 ? (
              connectedPlatforms.map(p => (
                <div key={p} className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#242424] bg-[#0D0D0D] shadow-lg ring-1 ring-white/10" title={`${p} Connected`}>
                  {getPlatformIcon(p)}
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"></span>
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-white/10 bg-white/[0.02]" title="No accounts connected">
                <FiGlobe className="h-3 w-3 text-white/20" />
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.03]" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="group/item relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 text-center transition-all duration-200 hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02]">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <FiCheck className="h-3.5 w-3.5 text-[#FF3B3B]" />
                </div>
                <h3 className="font-plus-jakarta text-xl font-black text-white">{totalPosted}</h3>
                <span className="font-plus-jakarta text-[9px] font-bold uppercase tracking-widest text-white/40">Total Posted</span>
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
              </div>

              <div className="group/item relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 text-center transition-all duration-200 hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02]">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <FiClock className="h-3.5 w-3.5 text-[#FF3B3B]" />
                </div>
                <h3 className="font-plus-jakarta text-xl font-black text-white">{totalScheduled}</h3>
                <span className="font-plus-jakarta text-[9px] font-bold uppercase tracking-widest text-white/40">Scheduled</span>
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
              </div>
            </div>

            {/* Recent Posts */}
            <div className="flex-1 flex flex-col gap-2">
              <span className="font-plus-jakarta text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 mb-1">
                Recent Posts
              </span>
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group/item relative flex items-center gap-3 overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] px-3 py-2.5 transition-all duration-200 hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02]"
                  >
                    {/* Platform icons */}
                    <div className="flex -space-x-1 flex-shrink-0">
                      {post.platforms.slice(0, 3).map((p, i) => (
                        <div key={i} className="flex h-5 w-5 items-center justify-center rounded bg-[#FF3B3B]/10">
                          {getPlatformIcon(p)}
                        </div>
                      ))}
                    </div>

                    {/* Caption */}
                    <p className="flex-1 min-w-0 truncate font-plus-jakarta text-xs text-white/80">
                      {post.caption || "No caption"}
                    </p>

                    {/* Status + Time */}
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span
                        className={`font-plus-jakarta text-[9px] font-bold uppercase tracking-wider ${
                          post.status === "published"
                            ? "text-emerald-400"
                            : post.status === "scheduled"
                            ? "text-blue-400"
                            : post.status === "failed"
                            ? "text-[#FF6C6C]"
                            : "text-white/40"
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="flex items-center gap-1 font-plus-jakarta text-[9px] text-white/30">
                        <FiClock className="h-2.5 w-2.5" />
                        {getRelativeTime(post.publishedAt || post.scheduledAt || "")}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <p className="font-plus-jakarta text-xs text-white/40">No posts yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialInsightsCard;
