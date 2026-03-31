import { type FC } from "react";
import { FiChevronDown } from "react-icons/fi";

const TaskProgressTrend: FC = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  
  // Refined SVG Paths to match reference curves
  const primaryLinePath = "M 0 142 Q 100 135 150 100 T 270 70 Q 320 70 380 40 T 600 20";
  const primaryAreaPath = `${primaryLinePath} V 150 H 0 Z`;
  const secondaryLinePath = "M 0 115 Q 60 100 120 135 T 250 115 Q 350 115 400 65 T 600 105";

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-[32px] p-8 h-full font-plus-jakarta relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-white tracking-tight">Task Progress Overview</h2>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-white/5 rounded-2xl text-[11px] font-black text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-xl">
          Last 7 Days
          <FiChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Chart Visualization */}
      <div className="relative h-[280px] w-full mt-10">
        <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="primaryAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="primaryStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#EF4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Secondary Trend (Darker) */}
          <path 
            d={secondaryLinePath} 
            fill="none" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeOpacity="0.1" 
            strokeLinecap="round"
          />

          {/* Primary Trend Area Fill */}
          <path d={primaryAreaPath} fill="url(#primaryAreaGradient)" />
          
          {/* Primary Trend Stroke */}
          <path 
            d={primaryLinePath} 
            fill="none" 
            stroke="url(#primaryStrokeGradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          />

          {/* Active Data Point (between WED and THU in the ref) */}
          <g transform="translate(266, 74)">
            <circle r="8" fill="#121212" />
            <circle r="6" fill="#EF4444" className="animate-pulse shadow-2xl" />
            <circle r="12" fill="none" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.2" />
          </g>
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between items-end px-4 mt-2">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-4">
            <span 
              className={`text-[10px] font-black uppercase tracking-widest ${i === 3 ? "text-white" : "text-gray-500"}`}
            >
              {day}
            </span>
            {/* THU Indicator Bar */}
            {i === 3 && (
              <div className="w-16 h-1.5 bg-[#EF4444] rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)] -mb-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskProgressTrend;
