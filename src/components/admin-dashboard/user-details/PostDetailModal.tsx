import React from "react";
import {
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaBell,
  FaCog,
  FaShareAlt,
} from "react-icons/fa";
import type { SocialPost } from "../../../types/admin";

interface PostDetailModalProps {
  selectedPost: SocialPost;
  setSelectedPost: (post: SocialPost | null) => void;
  PLATFORM_META: Record<
    string,
    { icon: React.ElementType; color: string; name: string; bgClass: string }
  >;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  selectedPost,
  setSelectedPost,
  PLATFORM_META,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        onClick={() => setSelectedPost(null)}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] mx-auto bg-[#101014] border border-[#2c2c34] shadow-2xl rounded-xl overflow-hidden text-white transform transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-[#2c2c34]">
          <h2 className="text-xl font-bold tracking-wider uppercase text-gray-200">
            Post Insight
          </h2>
          <button
            onClick={() => setSelectedPost(null)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1f]"
            aria-label="Close"
          >
            <FaTimesCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#2c2c34] max-h-[78vh] sm:max-h-[75vh] overflow-y-auto lg:overflow-hidden">
          <div className="lg:col-span-3 p-3 space-y-3">
            <h3 className="text-lg font-semibold text-gray-200">
              Post Content
            </h3>

            <div className="p-2 space-y-4">
              {selectedPost.image?.buffer ? (
                <div className="relative w-full rounded-md overflow-hidden bg-black/40 flex items-center justify-center border-2 border-dotted border-gray-600">
                  <img
                    src={`data:${
                      selectedPost.image.mimetype || "image/jpeg"
                    };base64,${selectedPost.image.buffer}`}
                    alt={
                      selectedPost.caption
                        ? selectedPost.caption.slice(0, 60)
                        : "Post media"
                    }
                    className="w-full max-h-72 object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-black/50 flex items-center justify-center rounded-md border-2 border-dotted border-gray-600">
                  <span className="text-gray-500 text-sm">
                    No visual media attached
                  </span>
                </div>
              )}

              <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[40px] max-h-40 md:max-h-56 overflow-y-auto pr-1 pt-2">
                {selectedPost.caption || (
                  <span className="text-gray-500 italic">
                    No caption added.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 space-y-4">
            <div className="space-y-4 border-b border-gray-700/50 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs ring-1 transition-all ${
                    selectedPost.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                      : selectedPost.status === "scheduled"
                      ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30"
                      : selectedPost.status === "failed"
                      ? "bg-rose-500/10 text-rose-400 ring-rose-500/30"
                      : "bg-gray-500/10 text-gray-400 ring-gray-500/30"
                  }`}
                >
                  {selectedPost.status === "published" && (
                    <FaCheckCircle className="w-3 h-3" />
                  )}
                  {selectedPost.status === "scheduled" && (
                    <FaClock className="w-3 h-3" />
                  )}
                  {selectedPost.status === "failed" && (
                    <FaTimesCircle className="w-3 h-3" />
                  )}
                  {selectedPost.status === "cancelled" && (
                    <FaBell className="w-3 h-3" />
                  )}
                  <span className="uppercase tracking-widest">
                    {selectedPost.status}
                  </span>
                </div>
              </div>
              <div className="text-sm font-light text-gray-300 flex items-center gap-2">
                <FaCog className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-400">
                  {selectedPost.status === "scheduled"
                    ? "Scheduled at:"
                    : "Published at:"}
                </span>
                <span className="font-semibold text-white">
                  {new Date(
                    selectedPost.publishedAt || selectedPost.scheduledAt
                  ).toLocaleDateString()}{" "}
                  at{" "}
                  {new Date(
                    selectedPost.publishedAt || selectedPost.scheduledAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="border-b border-gray-700/50 pb-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Target Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedPost.platforms?.map((p) => {
                  const platformMeta =
                    PLATFORM_META[p.toLowerCase()] || PLATFORM_META.facebook;
                  const PlatformIcon = platformMeta.icon;
                  return (
                    <div
                      key={p}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1f] rounded-full border"
                      style={{
                        borderColor: `${platformMeta.color}30`,
                        backgroundColor: `${platformMeta.color}10`,
                      }}
                    >
                      <PlatformIcon
                        size={14}
                        style={{ color: platformMeta.color }}
                      />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: platformMeta.color }}
                      >
                        {platformMeta.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedPost.accounts &&
              Array.isArray(selectedPost.accounts) &&
              selectedPost.accounts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Accounts
                  </h3>
                  <div className="space-y-3">
                    {selectedPost.accounts.map((acc, idx) => {
                      const initials = (
                        acc.name ||
                        acc.username ||
                        acc.platform ||
                        "?"
                      )
                        .trim()
                        .charAt(0)
                        .toUpperCase();
                      return (
                        <div
                          key={`${acc.platform}-${idx}`}
                          className="flex items-center justify-between bg-[#1a1a1f] border border-[#2c2c34] rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full border border-[#2c2c34] overflow-hidden bg-[#0f0f13] flex-shrink-0">
                              {acc.profileImage ? (
                                <img
                                  src={acc.profileImage}
                                  alt={acc.username || acc.name || "Account"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-300 text-sm font-semibold">
                                  {initials}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-white text-sm truncate">
                                {acc.name || acc.username || "Unknown account"}
                              </div>
                              <div className="text-gray-400 text-xs truncate">
                                {acc.username
                                  ? `@${acc.username.replace(/^@/, "")}`
                                  : acc.platform}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaShareAlt size={14} className="text-blue-400" />
                            <span className="text-gray-400 text-xs uppercase tracking-wider">
                              {acc.platform}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
