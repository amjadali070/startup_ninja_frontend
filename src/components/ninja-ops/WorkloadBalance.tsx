import { type FC } from "react";

const WorkloadBalance: FC = () => {
  const legendRows = [1, 2, 3, 4];

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[40px] bg-[#121212] font-plus-jakarta flex flex-col p-10 lg:p-12 shadow-2xl">
      {/* Subtle Centered Glow behind the chart */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#EF4444] blur-[150px] opacity-[0.03] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full mb-10">
        <h2 className="text-2xl font-black text-white tracking-tight leading-none">Workload Balance</h2>
      </div>

      {/* Donut Chart - Bold Reference Styling */}
      <div className="relative w-full flex flex-col items-center justify-center my-4">
        <div className="relative w-64 h-64 lg:w-72 lg:h-72 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Background Circle (Track) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#220507"
              strokeWidth="8"
            />
            {/* Active Segment (72%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke="#EF4444"
              strokeWidth="8"
              strokeDasharray="171.8 238.8" // 72% of 2 * PI * 38
              strokeLinecap="round"
              className="drop-shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-white leading-none tracking-tighter">72%</span>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mt-3">CAPACITY</span>
          </div>
        </div>
      </div>

      {/* Repeating Legend Grid - 100% Design Match */}
      <div className="mt-12 space-y-7 px-4">
        {legendRows.map((_, i) => (
          <div key={i} className="grid grid-cols-2 gap-x-12">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
              <span className="text-sm font-bold text-gray-300">Allocated (280h)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#1A1A1A]" />
              <span className="text-sm font-bold text-gray-500">Buffer (110h)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkloadBalance;
