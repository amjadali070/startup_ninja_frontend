import { type FC } from "react";
import { FiMessageSquare, FiCalendar, FiLink } from "react-icons/fi";

const RecentLeadActivity: FC = () => {
  const activities = [
    {
      user: "Alex opened proposal",
      detail: "CyberDyne Systems",
      time: "2m ago",
      icon: <FiMessageSquare className="w-4 h-4 text-[#EF4444]" />,
    },
    {
      user: "Sam scheduled demo",
      detail: "Weyland-Yutani",
      time: "45m ago",
      icon: <FiCalendar className="w-4 h-4 text-[#EF4444]" />,
    },
    {
      user: "New lead from LinkedIn",
      detail: "InGen Corp",
      time: "3h ago",
      icon: <FiLink className="w-4 h-4 text-[#EF4444]" />,
    },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 h-full font-plus-jakarta flex flex-col gap-8 group overflow-hidden relative shadow-2xl">
      <div className="flex items-center gap-3 mb-2">
        <FiMessageSquare className="text-[#EF4444] w-5 h-5" />
        <h2 className="text-xl font-black text-white tracking-tight uppercase">Recent Lead Activity</h2>
      </div>

      <div className="flex-1 flex flex-col gap-6 py-2">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-center gap-5 group/item transition-all hover:translate-x-2">
            <div className="bg-[#EF444410] p-4 rounded-full border border-[#EF444415] shadow-lg">
              {activity.icon}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-sm font-black text-white tracking-tight group-hover/item:text-[#EF4444] transition-colors">{activity.user}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{activity.detail}</span>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-widest">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EF444405] blur-[40px] rounded-full" />
    </div>
  );
};

export default RecentLeadActivity;
