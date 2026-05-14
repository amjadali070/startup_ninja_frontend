import React from "react";

interface BarPoint {
  label: string;
  value: number;
}

interface AdminInsightBarChartProps {
  title: string;
  subtitle?: string;
  points: BarPoint[];
}

const AdminInsightBarChart: React.FC<AdminInsightBarChartProps> = ({
  title,
  subtitle,
  points,
}) => {
  if (!points?.length) {
    return (
      <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
        <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">{title}</h3>
        <p className="text-xs text-gray-500 mt-4">No distribution data available</p>
      </div>
    );
  }

  const max = Math.max(...points.map((p) => p.value), 1);
  const total = points.reduce((sum, p) => sum + p.value, 0);
  const topItem = points.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), points[0]);

  return (
    <div className="bg-[#151515] border border-[#242424] rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white text-sm uppercase tracking-[0.2em] font-semibold">{title}</h3>
          {subtitle ? <p className="text-xs text-gray-400 mt-1 mb-4">{subtitle}</p> : <div className="mb-4" />}
        </div>
        <div className="text-right text-[11px]">
          <p className="text-gray-400">Top Segment</p>
          <p className="text-white font-semibold capitalize">{topItem.label}</p>
        </div>
      </div>

      <div className="space-y-3">
        {points.map((point, index) => {
          const percentage = total > 0 ? (point.value / total) * 100 : 0;
          const widthPercent =
            point.value <= 0 ? 0 : Math.max(4, (point.value / max) * 100);
          const gradient =
            index % 3 === 0
              ? "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)"
              : index % 3 === 1
                ? "linear-gradient(90deg, #ef4444 0%, #991b1b 100%)"
                : "linear-gradient(90deg, #f87171 0%, #b91c1c 100%)";

          return (
          <div key={`${title}-${point.label}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-300 capitalize">{point.label}</span>
              <span className="text-xs text-white font-semibold flex items-center gap-2">
                <span>{point.value.toLocaleString()}</span>
                <span className="text-gray-500">{percentage.toFixed(1)}%</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${widthPercent}%`,
                  background: gradient,
                  transition: "width 350ms ease",
                }}
              />
            </div>
          </div>
        );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
          <p className="text-gray-400">Total</p>
          <p className="text-white font-semibold">{total.toLocaleString()}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1.5">
          <p className="text-gray-400">Categories</p>
          <p className="text-white font-semibold">{points.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminInsightBarChart;
