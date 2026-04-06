import { type FC, useEffect, useState } from "react";
import { FiTrendingUp } from "react-icons/fi";

const forecastData = [
  { month: "Sep", label: "September", value: 35, amount: "$350k", isEst: false },
  { month: "Oct", label: "October", value: 45, amount: "$450k", isEst: false },
  { month: "Nov", label: "November", value: 85, amount: "$850k", isEst: true },
  { month: "Dec", label: "December", value: 55, amount: "$550k", isEst: false },
  { month: "Jan", label: "January", value: 40, amount: "$400k", isEst: false },
];

const gridLines = [100, 75, 50, 25, 0];

const RevenueForecast: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-[#121212] border border-white/[0.04] rounded-2xl p-4 sm:p-8 h-full font-plus-jakarta flex flex-col gap-4 sm:gap-5 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-[#EF4444] w-4 h-4 flex-shrink-0" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Revenue Forecast</h2>
          </div>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest pl-6">Sep 2024 – Jan 2025</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 pl-6 sm:pl-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/20 flex-shrink-0" />
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0" />
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Forecast</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="flex-1 flex gap-2 sm:gap-3 min-h-[180px] sm:min-h-[200px]">
        {/* Y-axis labels */}
        <div className="hidden sm:flex flex-col justify-between pb-7 pr-1">
          {gridLines.map((v) => (
            <span key={v} className="text-[9px] text-gray-600 font-bold tabular-nums leading-none">
              {v === 0 ? "0" : `${v}%`}
            </span>
          ))}
        </div>

        {/* Grid + bars */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Bars stacked */}
          <div className="flex-1 relative min-h-0">
            {/* Bars row */}
            <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2 pb-0">
              {forecastData.map((d, i) => {
                const isHov = hovered === i;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group/bar min-w-0"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className="mb-1.5 sm:mb-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-center transition-all duration-200 pointer-events-none max-w-full"
                      style={{
                        opacity: isHov ? 1 : 0,
                        transform: isHov ? "translateY(0)" : "translateY(4px)",
                        background: d.isEst ? "#EF444418" : "#ffffff08",
                        borderColor: d.isEst ? "#EF444440" : "#ffffff15",
                      }}
                    >
                      <div className={`text-[10px] sm:text-[11px] font-black leading-none ${d.isEst ? "text-[#EF4444]" : "text-white"}`}>
                        {d.amount}
                      </div>
                      <div className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 truncate">{d.label}</div>
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-lg sm:rounded-xl border transition-all duration-700 ease-out relative overflow-hidden ${d.isEst
                        ? "bg-[#EF4444] border-[#EF444460]"
                        : isHov
                          ? "bg-white/[0.08] border-white/10"
                          : "bg-white/[0.04] border-white/[0.05]"
                        }`}
                      style={{
                        height: mounted ? `${d.value}%` : "0%",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    >
                      {/* Shimmer on estimated bar */}
                      {d.isEst && (
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis month labels */}
          <div className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            {forecastData.map((d, i) => (
              <div key={i} className="flex-1 text-center min-w-0">
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest transition-colors block truncate ${hovered === i ? (d.isEst ? "text-[#EF4444]" : "text-white") : d.isEst ? "text-[#EF4444]/70" : "text-gray-600"
                    }`}
                >
                  {d.month}
                </span>
                {d.isEst && (
                  <div className="text-[7px] text-[#EF4444]/50 font-bold uppercase tracking-wider">est</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest font-bold truncate">Peak Forecast</span>
          <span className="text-xs sm:text-sm font-black text-[#EF4444] leading-none truncate">$850k <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold">in Nov</span></span>
        </div>
        <div className="flex flex-col items-end gap-0.5 min-w-0">
          <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest font-bold truncate">Avg Monthly</span>
          <span className="text-xs sm:text-sm font-black text-white leading-none">$520k</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueForecast;