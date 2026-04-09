import { type FC } from "react";

export interface StatItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  isAlert?: boolean;
  icon: React.ReactNode;
  progress?: number;
  highlight?: boolean;
  warning?: boolean;
}

interface SalesStatGridProps {
  stats: StatItem[];
}

const SalesStatGrid: FC<SalesStatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`group relative bg-[#121212] border border-white/[0.03] rounded-2xl p-8 hover:bg-[#161616] transition-all hover:border-[#EF444420] shadow-xl overflow-hidden ${stat.highlight ? 'border-l-2 border-l-red-600' : ''}`}
        >
          {/* Subtle icon glow on hover */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EF444405] blur-[40px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</span>
              <div className={`p-3 rounded-2xl border shadow-lg transition-all ${stat.warning || stat.isAlert ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/5 animate-pulse' : 'bg-[#EF444410] border-[#EF444415] text-[#EF4444] shadow-sm'}`}>
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
                <span className={`text-[10px] font-black uppercase tracking-widest ${stat.isAlert || stat.warning ? "text-red-500" : stat.isPositive ? "text-emerald-500" : "text-gray-500"}`}>
                  {stat.change || (stat.isAlert || stat.warning ? "Requires Attention" : "Market Trend")}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SalesStatGrid;
