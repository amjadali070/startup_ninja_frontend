import { type FC } from "react";

const NinjaLegalStats: FC = () => {
  const stats = [
    {
      label: "ACTIVE CONTRACTS",
      value: "12",
      subtext: "+2 this month",
      subtextColor: "text-[#dc2626]",
    },
    {
      label: "COMPLIANCE HEALTH",
      value: "98%",
      hasBadge: false,
      hasAccent: true,
    },
    {
      label: "OPEN LEGAL QUERIES",
      value: "3",
      subtext: "Awaiting Ninja AI",
      subtextColor: "text-gray-400",
    },
    {
      label: "UPCOMING RENEWALS",
      value: "5",
      subtext: "ACTION REQUIRED",
      isStatus: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 font-plus-jakarta">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#121212] border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-[#dc262630] transition-all"
        >
          <div>
            <p className="text-[10px] font-extrabold text-gray-500 tracking-[0.1em] uppercase">
              {stat.label}
            </p>
          </div>

          <div className="flex items-end justify-between mt-4">
            <h3 className="text-3xl lg:text-4xl font-black text-white leading-none">
              {stat.value}
            </h3>

            {stat.subtext && !stat.isStatus && (
              <p className={`text-[11px] font-bold mb-1 ${stat.subtextColor}`}>
                {stat.subtext}
              </p>
            )}

            {stat.hasAccent && (
              <div className="w-14 h-1.5 bg-[#dc2626] rounded-full mb-1 ml-4" />
            )}

            {stat.isStatus && (
              <span className="bg-[#dc262626] text-[#dc2626] text-[9px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider mb-1">
                {stat.subtext}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NinjaLegalStats;
