import { type FC } from "react";
import { FiTrendingUp, FiFolder, FiAward, FiAlertCircle } from "react-icons/fi";

const NinjaSalesStats: FC = () => {
  const stats = [
    {
      label: "Active Leads",
      value: "42",
      change: "+12% this week",
      isPositive: true,
      icon: <FiTrendingUp className="w-5 h-5 text-[#EF4444]" />,
    },
    {
      label: "Pipeline Value",
      value: "$1.2M",
      change: "Target: $1.5M",
      isPositive: false,
      icon: <FiFolder className="w-5 h-5 text-[#EF4444]" />,
    },
    {
      label: "Win Rate",
      value: "68%",
      progress: 68,
      icon: <FiAward className="w-5 h-5 text-[#EF4444]" />,
    },
    {
      label: "Overdue Follow-ups",
      value: "5",
      change: "Requires Immediate Action",
      isAlert: true,
      icon: <FiAlertCircle className="w-5 h-5 text-[#EF4444]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="group relative bg-[#121212] border border-white/[0.03] rounded-2xl p-8 hover:bg-[#161616] transition-all hover:border-[#EF444420] shadow-xl overflow-hidden">
          {/* Subtle icon glow on hover */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF444405] blur-[40px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className="bg-[#EF444410] p-3 rounded-2xl border border-[#EF444415] shadow-lg">
                {stat.icon}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white tracking-tight mb-3 group-hover:scale-105 transition-transform origin-left">{stat.value}</h3>

              {stat.progress !== undefined ? (
                <div className="space-y-3">
                  <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#EF4444] transition-all duration-[1.5s] ease-out rounded-full shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                      style={{ width: `${stat.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.isAlert ? "text-[#EF4444] animate-pulse" : stat.isPositive ? "text-emerald-500" : "text-gray-500"}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NinjaSalesStats;
