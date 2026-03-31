import { type FC } from "react";
import { FiCheckSquare, FiTarget, FiZap, FiActivity } from "react-icons/fi";

const NinjaOpsStats: FC = () => {
  const stats = [
    {
      label: "Active Tasks",
      value: "142",
      subtext: "+5 Since 03:00",
      subtextColor: "text-[#EF4444]",
      icon: <FiCheckSquare className="text-[#EF4444]" />,
      progress: 65,
      progressColor: "bg-[#EF4444]",
    },
    {
      label: "KPI Completion",
      value: "88%",
      subtext: "On Target",
      subtextColor: "text-[#EF4444]",
      icon: <FiTarget className="text-[#EF4444]" />,
      progress: 88,
      progressColor: "bg-[#EF4444]",
    },
    {
      label: "Team Productivity",
      value: "+12.4%",
      subtext: "Month Peak",
      subtextColor: "text-[#EF4444]",
      icon: <FiZap className="text-[#EF4444]" />,
      progress: 75,
      progressColor: "bg-[#EF4444]",
    },
    {
      label: "Org Health Score",
      value: "94/100",
      subtext: "Optimal",
      subtextColor: "text-[#EF4444]",
      icon: <FiActivity className="text-[#EF4444]" />,
      progress: 94,
      progressColor: "bg-[#EF4444]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-plus-jakarta">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#121212] border border-white/[0.03] rounded-[24px] p-6 lg:p-8 flex flex-col justify-between group hover:border-[#EF444420] transition-all relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-[#EF444410] p-2.5 rounded-xl border border-[#EF444420]">
              {stat.icon}
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.subtextColor}`}>
                {stat.subtext}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-1">
                {stat.label}
              </p>
              <h3 className="text-4xl font-black text-white leading-none tracking-tight">
                {stat.value}
              </h3>
            </div>

            {/* Progress Bar matching the reference UI */}
            <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.progressColor} transition-all duration-1000 opacity-80`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NinjaOpsStats;
