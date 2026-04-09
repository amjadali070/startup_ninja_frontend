import { type FC } from "react";

const PerformanceLeaders: FC = () => {
  const leaders = [
    { name: "Alex Rivera", role: "ENGINEERING LEAD", efficiency: "98.2%", color: "#EF4444", avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Sarah Chen", role: "PRODUCT DESIGN", efficiency: "96.5%", color: "#EF4444", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Marcus Thorne", role: "GROWTH OPS", efficiency: "94.1%", color: "#EF4444", avatar: "https://i.pravatar.cc/150?u=marcus" },
    // { name: "Lina Volkov", role: "OPS MANAGER", efficiency: "92.8%", color: "#EF4444", avatar: "https://i.pravatar.cc/150?u=lina" },
  ];

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 h-full font-plus-jakarta flex flex-col gap-6 group overflow-hidden relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white tracking-tight leading-none">Performance Leaders</h2>
        <div className="px-2 py-0.5 bg-[#EF444415] border border-[#EF444425] rounded-full flex items-center justify-center">
          <span className="text-[8px] font-black text-[#EF4444] uppercase tracking-widest">
            Q1 Top Percentile
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {leaders.map((leader, i) => (
          <div key={leader.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl group hover:border-[#EF444420] transition-all cursor-pointer shadow-lg active:scale-95">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#EF444430] blur-[12px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={leader.avatar}
                  alt={leader.name}
                  className="w-12 h-12 rounded-full border border-white/10 group-hover:border-[#EF444440] transition-colors relative z-10"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#EF4444] border-2 border-[#121212] rounded-full flex items-center justify-center text-[10px] text-white font-black z-20">
                  {i + 1}
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-black text-white tracking-tight group-hover:text-[#EF4444] transition-colors leading-tight mb-0.5">{leader.name}</h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{leader.role}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-black text-white leading-none mb-1">{leader.efficiency}</p>
              <p className="text-[9px] font-black text-[#EF4444] uppercase tracking-widest opacity-60">EFF.</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 mt-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-all hover:text-white group-hover:border-white/[0.1]">
        View Team Rank Details
      </button>

      {/* Decorative Blur */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#EF444410] blur-[40px] rounded-full" />
    </div>
  );
};

export default PerformanceLeaders;
