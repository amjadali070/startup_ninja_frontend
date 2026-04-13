import { type FC, useEffect, useState, useMemo } from "react";
import { FiTrendingUp } from "react-icons/fi";
import type { RevenueForecastData, RevenueForecastMonth } from "../../services/ninjaSales";

const gridLines = [100, 75, 50, 25, 0];

function formatCompactUsd(n: number): string {
  if (!n || n < 0) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${Math.round(n)}`;
}

interface RevenueForecastProps {
  revenueForecast?: RevenueForecastData | null;
}

const RevenueForecast: FC<RevenueForecastProps> = ({ revenueForecast }) => {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const forecastData = useMemo((): RevenueForecastMonth[] => {
    if (revenueForecast?.months?.length) return revenueForecast.months;
    return [];
  }, [revenueForecast]);

  /** Bar height as % of chart column; computed here so heights match dollar amounts (not rounded server percents). */
  const barHeightsPercent = useMemo(() => {
    const amounts = forecastData.map((d) => d.amount);
    const maxAmt = Math.max(...amounts, 1);
    return forecastData.map((d) => {
      const raw = maxAmt > 0 ? (d.amount / maxAmt) * 100 : 0;
      return Math.max(raw, d.amount > 0 ? 2 : 0);
    });
  }, [forecastData]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const peakLabel = revenueForecast?.peak
    ? `${formatCompactUsd(revenueForecast.peak.amount)} in ${revenueForecast.peak.monthShort}`
    : "—";
  const avgLabel = revenueForecast != null ? formatCompactUsd(revenueForecast.avgMonthly) : "—";
  const rangeLabel = revenueForecast?.rangeLabel ?? "—";

  return (
    <div className="bg-[#121212] border border-white/[0.04] rounded-2xl p-4 sm:p-8 h-full font-plus-jakarta flex flex-col gap-4 sm:gap-5 shadow-2xl overflow-hidden">

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-[#EF4444] w-4 h-4 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide leading-tight">Revenue Forecast</h2>
          </div>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest pl-6">{rangeLabel}</p>
        </div>

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

      {forecastData.length === 0 ? (
        <p className="text-sm text-gray-500 py-8">No revenue data yet. Close deals or set forecast dates on open projects.</p>
      ) : (
        <div className="flex-1 flex gap-2 sm:gap-3 min-h-[180px] sm:min-h-[200px]">
          <div className="hidden sm:flex flex-col justify-between pb-7 pr-1">
            {gridLines.map((v) => (
              <span key={v} className="text-[9px] text-gray-600 font-bold tabular-nums leading-none">
                {v === 0 ? "0" : `${v}%`}
              </span>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 relative min-h-[160px] sm:min-h-[180px]">
              <div className="absolute inset-0 flex items-stretch gap-1.5 sm:gap-2 pb-0">
                {forecastData.map((d, i) => {
                  const isHov = hovered === i;
                  const hPct = barHeightsPercent[i] ?? 0;
                  return (
                    <div
                      key={`${d.label}-${i}`}
                      className="flex-1 flex flex-col justify-end h-full min-h-0 min-w-0 relative cursor-pointer group/bar"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Tooltip does not affect bar layout (absolute) */}
                      <div
                        className="absolute left-1/2 bottom-full z-10 -translate-x-1/2 mb-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-center transition-all duration-200 pointer-events-none max-w-[min(100%,140px)] whitespace-nowrap"
                        style={{
                          opacity: isHov ? 1 : 0,
                          transform: isHov ? "translate(-50%, 0)" : "translate(-50%, 4px)",
                          background: d.isForecast ? "#EF444418" : "#ffffff08",
                          borderColor: d.isForecast ? "#EF444440" : "#ffffff15",
                          visibility: isHov ? "visible" : "hidden",
                        }}
                      >
                        <div className={`text-[10px] sm:text-[11px] font-black leading-none ${d.isForecast ? "text-[#EF4444]" : "text-white"}`}>
                          {formatCompactUsd(d.amount)}
                        </div>
                        <div className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 truncate max-w-[120px]">{d.label}</div>
                      </div>

                      <div
                        className={`w-full rounded-lg sm:rounded-xl border transition-all duration-700 ease-out relative overflow-hidden shrink-0 ${d.isForecast
                          ? "bg-[#EF4444] border-[#EF444460]"
                          : isHov
                            ? "bg-white/[0.08] border-white/10"
                            : "bg-white/[0.04] border-white/[0.05]"
                          }`}
                        style={{
                          height: mounted ? `${hPct}%` : "0%",
                          minHeight: d.amount > 0 && hPct < 3 ? 3 : undefined,
                          transitionDelay: `${i * 80}ms`,
                        }}
                      >
                        {d.isForecast && (
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              {forecastData.map((d, i) => (
                <div key={`x-${d.label}-${i}`} className="flex-1 text-center min-w-0">
                  <span
                    className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest transition-colors block truncate ${hovered === i ? (d.isForecast ? "text-[#EF4444]" : "text-white") : d.isForecast ? "text-[#EF4444]/70" : "text-gray-600"
                      }`}
                  >
                    {d.month}
                  </span>
                  {d.isForecast && (
                    <div className="text-[7px] text-[#EF4444]/50 font-bold uppercase tracking-wider">est</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest font-bold truncate">Peak {revenueForecast?.peak ? "(in range)" : ""}</span>
          <span className="text-xs sm:text-sm font-black text-[#EF4444] leading-none truncate">{peakLabel}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5 min-w-0">
          <span className="text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest font-bold truncate">Avg Monthly</span>
          <span className="text-xs sm:text-sm font-black text-white leading-none">{avgLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueForecast;
