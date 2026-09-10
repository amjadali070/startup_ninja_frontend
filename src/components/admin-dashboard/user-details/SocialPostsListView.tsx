import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import type { SocialPost } from "../../../types/admin";

interface SocialPostsListViewProps {
  socialPosts: SocialPost[];
  setSelectedPost: (post: SocialPost) => void;
  PLATFORM_META: Record<
    string,
    { icon: React.ElementType; color: string; name: string; bgClass: string }
  >;
}

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const SocialPostsListView: React.FC<SocialPostsListViewProps> = ({
  socialPosts,
  setSelectedPost,
  PLATFORM_META,
}) => {
  if (socialPosts.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        No social posts found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {socialPosts.map((post) => {
        const imageSrc = post.image?.buffer
          ? `data:${post.image.mimetype || "image/jpeg"};base64,${
              post.image.buffer
            }`
          : null;

        // Get primary platform for card styling
        const primaryPlatform = post.platforms[0]?.toLowerCase() || "facebook";
        const platformInfo =
          PLATFORM_META[primaryPlatform] || PLATFORM_META.facebook;
        const PlatformIcon = platformInfo.icon;

        return (
          <div
            key={post._id}
            className="bg-[#1A1A1A] rounded-xl border border-[#242424] hover:border-[#444] transition-colors cursor-pointer overflow-hidden flex flex-col"
            onClick={() => setSelectedPost(post)}
          >
            {imageSrc && (
              <div className="w-full h-32 overflow-hidden bg-black/50 relative">
                <img
                  src={imageSrc}
                  alt="Post image"
                  className="w-full h-full object-cover"
                />
                {/* Platform badge on image */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {post.platforms.slice(0, 3).map((platform) => {
                    const meta =
                      PLATFORM_META[platform.toLowerCase()] ||
                      PLATFORM_META.facebook;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={platform}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${meta.bgClass} backdrop-blur-sm border border-white/10`}
                        style={{ backgroundColor: `${meta.color}15` }}
                      >
                        <Icon size={12} style={{ color: meta.color }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="p-3 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${platformInfo.bgClass}`}
                    style={{
                      backgroundColor: `${platformInfo.color}20`,
                    }}
                  >
                    <PlatformIcon
                      className="text-xs"
                      style={{ color: platformInfo.color }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.platforms.map((platform, idx) => {
                      const meta =
                        PLATFORM_META[platform.toLowerCase()] ||
                        PLATFORM_META.facebook;
                      return (
                        <React.Fragment key={platform}>
                          {idx > 0 && (
                            <span className="text-gray-500 text-xs">,</span>
                          )}
                          <span
                            className="text-xs font-medium"
                            style={{ color: meta.color }}
                          >
                            {meta.name}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    post.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : post.status === "scheduled"
                      ? "bg-blue-500/20 text-blue-400"
                      : post.status === "failed"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-300 text-xs mb-2 line-clamp-3 flex-1">
                {post.caption}
              </p>

              {post.accounts &&
                Array.isArray(post.accounts) &&
                post.accounts.length > 0 && (
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {post.accounts.slice(0, 2).map((account, idx) => {
                      if (
                        !account ||
                        typeof account !== "object" ||
                        !account.platform
                      ) {
                        return null;
                      }
                      const meta =
                        PLATFORM_META[account.platform.toLowerCase()] ||
                        PLATFORM_META.facebook;
                      const Icon = meta.icon;

                      // Use name if available, otherwise use platform name
                      // Don't show username if it looks like an ID (all digits)
                      let displayName = account.name;
                      if (!displayName) {
                        const username = account.username || "";
                        // Check if username is just a numeric ID
                        if (username && !/^\d+$/.test(username)) {
                          displayName = username;
                        } else {
                          displayName = meta.name + " Account";
                        }
                      }

                      return (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded flex items-center gap-1"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                            border: `1px solid ${meta.color}30`,
                          }}
                        >
                          <Icon size={10} />
                          {displayName}
                        </span>
                      );
                    })}
                    {post.accounts.length > 2 && (
                      <span className="px-2 py-1 bg-[#2A2A2A] text-gray-400 text-xs rounded">
                        +{post.accounts.length - 2}
                      </span>
                    )}
                  </div>
                )}

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-[#242424] pt-3 mt-auto">
                <span>{formatDate(post.scheduledAt)}</span>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  View <FaArrowLeft className="rotate-180 text-xs" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SocialPostsListView;
