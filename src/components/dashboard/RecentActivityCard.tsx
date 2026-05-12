import { useState, useEffect, type FC } from "react";
import { FiClock, FiFileText, FiMessageSquare, FiGlobe, FiActivity, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ninjaSalesService, type DashboardRecentActivity } from "../../services/ninjaSales";

export interface ActivityItem {
  id: string;
  type: "document" | "image" | "chat" | "website" | "social" | "system";
  action: string;
  target: string;
  time: string;
  link?: string;
}

const getIconForType = (type: ActivityItem["type"]) => {
  switch (type) {
    case "document":
      return <FiFileText className="h-3.5 w-3.5 text-[#FF3B3B]" />;
    case "chat":
      return <FiMessageSquare className="h-3.5 w-3.5 text-[#FF3B3B]" />;
    case "website":
      return <FiGlobe className="h-3.5 w-3.5 text-[#FF3B3B]" />;
    case "social":
      return <FiTrendingUp className="h-3.5 w-3.5 text-[#FF3B3B]" />;
    default:
      return <FiActivity className="h-3.5 w-3.5 text-[#FF3B3B]" />;
  }
};

const mapActivityType = (type: string): { type: ActivityItem["type"]; link: string } => {
  if (type.includes("contract") || type.includes("legal")) return { type: "document", link: "/ai-tools/ninja-legal" };
  if (type.includes("proposal") || type.includes("invoice") || type.includes("lead") || type.includes("sale")) return { type: "document", link: "/ai-tools/ninja-sales" };
  if (type.includes("chat")) return { type: "chat", link: "/ai-tools/chat" };
  if (type.includes("website") || type.includes("web")) return { type: "website", link: "/ai-tools/web-builder" };
  if (type.includes("social") || type.includes("post")) return { type: "social", link: "/ai-tools/social-pro" };
  if (type.includes("image")) return { type: "image", link: "/ai-tools/image-gen" };
  return { type: "system", link: "/dashboard" };
};

const getRelativeTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const RecentActivityCard: FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await ninjaSalesService.getDashboardStats();
        if (res.success && res.data?.recentActivities) {
          const mapped: ActivityItem[] = res.data.recentActivities
            .slice(0, 8)
            .map((a: DashboardRecentActivity, i: number) => {
              const { type, link } = mapActivityType(a.type);
              return {
                id: a.id || String(i),
                type,
                action: a.title,
                target: a.leadCompany ? `${a.leadName} (${a.leadCompany})` : a.leadName,
                time: getRelativeTime(a.time),
                link,
              };
            });
          setActivities(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch recent activities", e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="group relative h-full w-full">
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-[#FF3B3B]/20 via-[#E50000]/10 to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full w-full flex-col rounded-lg border border-[#242424] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] p-4 shadow-[0px_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group-hover:border-[#2A2A2A] group-hover:shadow-[0px_12px_32px_rgba(0,0,0,0.5)] sm:p-5">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF3B3B]/20 to-[#B91C1C]/10 sm:h-9 sm:w-9">
            <FiActivity className="h-5 w-5 text-[#FF3B3B] sm:h-6 sm:w-6" />
          </div>
          <h2 className="font-plus-jakarta text-base font-bold text-white sm:text-lg">
            Recent Activity
          </h2>
        </div>

        {/* Divider */}
        <div className="mb-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Activity List */}
        <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 rounded-lg border border-[#2A2A2A] bg-white/[0.02] p-3">
                <div className="h-7 w-7 animate-pulse rounded-md bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
                  <div className="h-2.5 w-1/3 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => activity.link && navigate(activity.link)}
                className={`group/item relative flex items-start gap-3 overflow-hidden rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-3 text-left transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] sm:p-3.5 ${
                  activity.link ? "cursor-pointer hover:border-[#333333] hover:from-white/[0.06] hover:to-white/[0.02]" : ""
                }`}
              >
                <div className="flex-shrink-0 pt-0.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FF3B3B]/10">
                    {getIconForType(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-plus-jakarta text-xs leading-relaxed text-white/90 sm:text-[13px]">
                    {activity.action}{" "}
                    <span className="font-bold text-white">{activity.target}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 font-plus-jakarta text-[11px] text-white/40">
                    <FiClock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-700 group-hover/item:translate-x-full" />
              </div>
            ))
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03]">
                <FiClock className="h-5 w-5 text-white/30" />
              </div>
              <p className="font-plus-jakarta text-sm text-white/50">
                No recent activity found
              </p>
              <button
                onClick={() => navigate("/ai-tools/chat")}
                className="mt-3 font-plus-jakarta text-xs text-[#FF3B3B] transition-colors hover:text-[#FF6C6C]"
              >
                Start your first session →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;
