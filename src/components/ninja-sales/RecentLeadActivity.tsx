import { type FC } from "react";
import { FiMessageSquare, FiCalendar, FiLink, FiActivity } from "react-icons/fi";

const RecentLeadActivity: FC = () => {
  const activities = [
    {
      user: "Alex opened proposal",
      detail: "CyberDyne Systems",
      time: "2m ago",
      icon: <FiMessageSquare className="w-4 h-4" />,
      color: "#EF4444",
    },
    {
      user: "Sam scheduled demo",
      detail: "Weyland-Yutani",
      time: "45m ago",
      icon: <FiCalendar className="w-4 h-4" />,
      color: "#F59E0B",
    },
    {
      user: "New lead from LinkedIn",
      detail: "InGen Corp",
      time: "3h ago",
      icon: <FiLink className="w-4 h-4" />,
      color: "#10B981",
    },
    {
      user: "Pipeline stage updated",
      detail: "Umbrella Corp",
      time: "5h ago",
      icon: <FiActivity className="w-4 h-4" />,
      color: "#8B5CF6",
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-6 sm:p-8 h-full font-plus-jakarta flex flex-col gap-6 overflow-hidden relative shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/10">
            <FiMessageSquare className="text-[#EF4444] w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white tracking-wide">Recent Lead Activity</h2>
            <p className="text-[10px] text-white/30 font-medium tracking-wide mt-0.5">Live updates from your pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 flex flex-col relative">
        {/* Vertical connector line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-transparent" />

        {activities.map((activity, i) => (
          <div
            key={i}
            className="relative flex items-start gap-4 py-3 group/item transition-all duration-300 hover:bg-white/[0.02] rounded-2xl px-2 -mx-2 cursor-pointer"
          >
            {/* Icon node on the timeline */}
            <div
              className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover/item:scale-110 shadow-lg"
              style={{
                background: `${activity.color}12`,
                borderColor: `${activity.color}20`,
                color: activity.color,
              }}
            >
              {activity.icon}
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md -z-10"
                style={{ background: `${activity.color}25` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-sm font-semibold text-white/90 tracking-tight group-hover/item:text-white transition-colors truncate">
                {activity.user}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/40 font-medium truncate">{activity.detail}</span>
                <span className="w-1 h-1 rounded-full bg-white/10 flex-shrink-0" />
                <span
                  className="text-[11px] font-semibold flex-shrink-0"
                  style={{ color: activity.color }}
                >
                  {activity.time}
                </span>
              </div>
            </div>

            {/* Hover arrow indicator */}
            <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 group-hover/item:translate-x-0 -translate-x-1 self-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/30">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-white/[0.04]">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 group/btn active:scale-[0.98]">
          <span className="text-xs font-semibold text-white/50 group-hover/btn:text-white/70 tracking-wide transition-colors">View All Activity</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-white/30 group-hover/btn:text-white/50 group-hover/btn:translate-x-0.5 transition-all">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#EF4444]/[0.03] blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#8B5CF6]/[0.03] blur-[50px] rounded-full pointer-events-none" />
    </div>
  );
};

export default RecentLeadActivity;
