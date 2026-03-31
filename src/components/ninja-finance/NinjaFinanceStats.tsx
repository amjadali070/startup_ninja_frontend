import { type FC } from "react";
import { FiPocket, FiActivity, FiTrendingUp, FiShield } from "react-icons/fi";

const NinjaFinanceStats: FC = () => {
  const stats = [
    {
      label: "Cash Balance",
      value: "$1,420,500",
      subtext: "+12.3%",
      subtextColor: "text-[#10B981]",
      desc: "Across 3 linked accounts",
      icon: <FiPocket className="text-[#10B981]" />,
      badgeColor: "bg-[#10B98110] border-[#10B98120]",
    },
    {
      label: "Monthly Burn",
      value: "$84,200",
      subtext: "Steady",
      subtextColor: "text-gray-400",
      desc: "Targeting $75k by Q3",
      icon: <FiActivity className="text-gray-400" />,
      badgeColor: "bg-white/5 border-white/10",
    },
    {
      label: "Runway",
      value: "16.8 Months",
      subtext: "Critical",
      subtextColor: "text-[#EF4444]",
      desc: "Projected exhaustion: Dec 2025",
      icon: <FiTrendingUp className="text-[#EF4444]" />,
      badgeColor: "bg-[#EF444410] border-[#EF444420]",
    },
    {
      label: "Health Score",
      value: "92/100",
      subtext: "A+",
      subtextColor: "text-white",
      desc: "Top 5% for SaaS startups",
      icon: <FiShield className="text-white" />,
      badgeColor: "bg-white/10 border-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 font-plus-jakarta">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 flex flex-col justify-between h-[180px] group hover:border-[#EF444430] hover:bg-[#151515] transition-all relative overflow-hidden"
        >
          <div className="flex items-start justify-between relative z-10">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/[0.05] group-hover:bg-[#EF444415] group-hover:border-[#EF444425] transition-all">
              {stat.icon}
            </div>
            <div className={`px-3 py-1.5 rounded-full border ${stat.badgeColor} flex items-center`}>
              <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${stat.subtextColor}`}>
                {stat.subtext}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-2.5 mt-4">
              {stat.value}
            </h3>
            <div className="flex flex-col">
              <p className="text-[11px] font-black text-gray-500 tracking-[0.2em] uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-[10px] font-bold text-gray-700 truncate group-hover:text-gray-500 transition-colors uppercase tracking-widest">
                {stat.desc}
              </p>
            </div>
          </div>

          {/* Subtle Hover Effect */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#EF4444]/0 group-hover:bg-[#EF4444]/40 transition-all duration-500" />
        </div>
      ))}
    </div>
  );
};

export default NinjaFinanceStats;
