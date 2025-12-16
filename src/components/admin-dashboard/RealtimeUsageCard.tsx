import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface RealtimeUsageCardProps {
  requestsPerSecond: string;
  avgLatency: string;
  errorRate: string;
  timeoutPercentage: string;
  chartData: number[];
  timeframeOptions: string[];
  onTimeframeChange: (timeframe: string) => void;
  selectedTimeframe: string;
}

const RealtimeUsageCard: React.FC<RealtimeUsageCardProps> = ({
  requestsPerSecond,
  avgLatency,
  errorRate,
  timeoutPercentage,
  chartData,
  timeframeOptions,
  onTimeframeChange,
  selectedTimeframe,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTimeframeSelect = (timeframe: string) => {
    onTimeframeChange(timeframe);
    setIsDropdownOpen(false);
  };

  const maxChartValue = Math.max(...chartData);
  const maxBarHeight = 200; // Increased max height for taller bars

  const getBarHeight = (value: number) => {
    if (maxChartValue === 0) return 0;
    return Math.round((value / maxChartValue) * maxBarHeight);
  };

  return (
    <div className="w-full bg-[#1A1A1A] rounded-xl p-6 sm:p-5 h-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-white text-lg sm:text-xl font-bold font-plus-jakarta mb-3 sm:mb-0">
          Realtime Usage
        </h3>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-gray-700 transition-colors w-full sm:w-auto justify-between sm:justify-start"
          >
            <span>{selectedTimeframe}</span>
            <FaChevronDown
              className={`w-3 h-3 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 min-w-full sm:min-w-[120px]">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTimeframeSelect(option)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-6">
        <div>
          <div className="text-white text-xl sm:text-xl font-bold leading-tight">
            {requestsPerSecond}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">Requests</div>
        </div>

        <div>
          <div className="text-white text-xl sm:text-xl font-bold leading-tight">
            {avgLatency}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">
            Avg Latency
          </div>
        </div>

        <div>
          <div className="text-white text-xl sm:text-xl font-bold leading-tight">
            {errorRate}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">
            Error Rate
          </div>
        </div>

        <div>
          <div className="text-white text-xl sm:text-xl font-bold leading-tight">
            {timeoutPercentage}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm mt-2">Timeout</div>
        </div>
      </div>

      <div className="mt-4 sm:mt-4 flex-1">
        <div
          className="flex items-end justify-between gap-1 sm:gap-1 lg:gap-1 overflow-x-auto"
          style={{ height: `${maxBarHeight + 50}px` }}
        >
          {chartData.map((value, index) => {
            const barHeight = getBarHeight(value);
            return (
              <div
                key={index}
                className="rounded-t-sm flex-1 min-w-[12px] sm:min-w-[16px] lg:min-w-[20px] max-w-[24px] sm:max-w-[28px] lg:max-w-[36px] transition-all duration-300 hover:opacity-90"
                style={{
                  height: `${barHeight}px`,
                  minHeight: value > 0 ? "30px" : "0px",
                  background:
                    "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                }}
                title={`Value: ${value}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RealtimeUsageCard;
export { RealtimeUsageCard };
