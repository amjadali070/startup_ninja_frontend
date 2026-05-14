import React from "react";

interface Point {
  label: string;
  value: number;
}

interface AdminInsightLineChartProps {
  title: string;
  subtitle?: string;
  points: Point[];
  valuePrefix?: string;
}

const AdminInsightLineChart: React.FC<AdminInsightLineChartProps> = ({
  title,
  subtitle,
  points,
  valuePrefix = "",
}) => {
  if (!points?.length) {
    return (
      <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
        <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">{title}</h3>
        <p className="text-xs text-gray-500 mt-4">No insight data available</p>
      </div>
    );
  }

  const rawMax = Math.max(...points.map((p) => p.value), 1);
  const rawMin = Math.min(...points.map((p) => p.value), 0);
  const pad = Math.max((rawMax - rawMin) * 0.12, 1);
  const max = rawMax + pad;
  const min = Math.max(0, rawMin - pad);
  const range = Math.max(max - min, 1);
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const average = total / points.length;
  const latest = points[points.length - 1]?.value || 0;
  const previous = points[points.length - 2]?.value || 0;
  const growth = previous === 0 ? 0 : ((latest - previous) / previous) * 100;
  const peakPoint = points.reduce((maxP, p) => (p.value > maxP.value ? p : maxP), points[0]);

  const chartWidth = 100;
  const chartHeight = 50;
  const plotPadX = 3.5;
  const plotPadY = 3;
  const chartId = title.replace(/\s+/g, "-").toLowerCase();
  const coordinates = points
    .map((p, i) => {
      const x =
        points.length === 1
          ? chartWidth / 2
          : plotPadX + (i / (points.length - 1)) * (chartWidth - plotPadX * 2);
      const y =
        chartHeight -
        plotPadY -
        ((p.value - min) / range) * (chartHeight - plotPadY * 2);
      return { x, y, ...p };
    })
    .filter(Boolean);
  const path = coordinates.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPath = `${path} ${coordinates[coordinates.length - 1]?.x || chartWidth},${
    chartHeight - plotPadY
  } ${coordinates[0]?.x || 0},${chartHeight - plotPadY}`;
  const tickValues = [max, max - range / 2, min];

  return (
    <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">
            {title}
          </h3>
          {subtitle ? <p className="text-xs text-gray-400 mt-1">{subtitle}</p> : null}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">
            {valuePrefix}
            {latest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-[11px] mt-1 ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}% vs previous
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 rounded-lg p-3">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36">
          <defs>
            <linearGradient id={`${chartId}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id={`${chartId}-area`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(220, 38, 38, 0.40)" />
              <stop offset="100%" stopColor="rgba(220, 38, 38, 0.02)" />
            </linearGradient>
          </defs>
          {tickValues.map((tick) => {
            const y =
              chartHeight -
              plotPadY -
              ((tick - min) / range) * (chartHeight - plotPadY * 2);
            return (
              <line
                key={`${chartId}-tick-${tick}`}
                x1={plotPadX}
                y1={y}
                x2={chartWidth - plotPadX}
                y2={y}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="1.4 1.6"
                strokeWidth="0.25"
              />
            );
          })}
          {coordinates.map((c, i) => (
            <rect
              key={`${chartId}-bar-${c.label}-${i}`}
              x={c.x - 0.5}
              y={c.y}
              width="1"
              height={Math.max(0, chartHeight - plotPadY - c.y)}
              fill="rgba(220,38,38,0.22)"
              rx="0.4"
            />
          ))}
          <polygon fill={`url(#${chartId}-area)`} points={areaPath} />
          <polyline
            fill="none"
            stroke={`url(#${chartId}-line)`}
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={path}
          />
          {coordinates.map((c, i) => {
            const isLatest = i === coordinates.length - 1;
            return (
              <circle
                key={`${c.label}-${i}`}
                cx={c.x}
                cy={c.y}
                r={isLatest ? "1.9" : "1.35"}
                fill={isLatest ? "#fca5a5" : "#f87171"}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1">
        {points.slice(-7).map((p, idx) => (
          <span
            key={`${title}-${p.label}-${idx}`}
            className="text-[10px] text-gray-500 truncate"
          >
            {p.label}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
          <p className="text-gray-400">Average</p>
          <p className="text-white font-semibold">
            {valuePrefix}
            {average.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
          <p className="text-gray-400">Peak</p>
          <p className="text-white font-semibold">
            {valuePrefix}
            {peakPoint.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
          <p className="text-gray-400">Total</p>
          <p className="text-white font-semibold">
            {valuePrefix}
            {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminInsightLineChart;
