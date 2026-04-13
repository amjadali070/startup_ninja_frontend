import { type FC } from "react";
import { FiUsers, FiBarChart2, FiStar, FiCalendar, FiX } from "react-icons/fi";
import { KpiData } from "../../services/ninja-legal";

interface ComplianceMonitorProps {
  kpiData?: KpiData | null;
  isLoading?: boolean;
}



const ComplianceMonitor: FC<ComplianceMonitorProps> = ({ kpiData, isLoading = false }) => {
  // Set default values if data is not available
  const defaultData: KpiData = {
    workloadHeatMap: {
      totalContracts: 0,
      priority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
    },
    complexityIndex: 0,
    HighvalueContracts: 0,
    expirySummary: {
      expiringIn90Days: 0,
      expiredCount: 0,
    },
  };

  const data = kpiData || defaultData;
  const totalContracts = data.workloadHeatMap.totalContracts || 1; // Avoid division by zero

  const priorityData = [
    { label: "Urgent", count: data.workloadHeatMap.priority.urgent, color: "#dc2626" },
    { label: "High", count: data.workloadHeatMap.priority.high, color: "#ea580c" },
    { label: "Medium", count: data.workloadHeatMap.priority.medium, color: "#ca8a04" },
    { label: "Low", count: data.workloadHeatMap.priority.low, color: "#16a34a" },
  ];

  // Calculate percentages
  const complexityPercentage = totalContracts > 0 ? Math.round((data.complexityIndex / totalContracts) * 100) : 0;
  const highValuePercentage = totalContracts > 0 ? Math.round((data.HighvalueContracts / totalContracts) * 100) : 0;

  const complianceMetrics = [
    { label: "Expiry Coverage", value: `${100 - Math.round((data.expirySummary.expiredCount / (totalContracts || 1)) * 100)}%`, icon: <FiCalendar className="w-4 h-4" />, color: "#a78bfa" },
    { label: "Expired Contracts", value: data.expirySummary.expiredCount, icon: <FiX className="w-4 h-4" />, color: "#dc2626" },
  ];

  if (isLoading) {
    return (
      <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-5 flex flex-col gap-0 font-plus-jakarta h-full">
        <div className="flex items-center gap-3">
          <div className="text-[#dc2626] bg-[#dc262610] p-2 rounded-lg border border-[#dc262620]">
            <FiBarChart2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white tracking-widest uppercase text-xs">
            Compliance METRICS
          </h3>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading KPI data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-[#2c2c2c] rounded-2xl p-5 flex flex-col gap-0 font-plus-jakarta h-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-[#dc2626] bg-[#dc262610] p-2 rounded-lg border border-[#dc262620]">
          <FiBarChart2 className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-white tracking-widest uppercase text-xs">
          Compliance METRICS
        </h3>
      </div>

      {/* KPI List - Row Wise */}
      <div className="space-y-2 mt-6">
        
        {/* KPI 1: WORKLOAD HEAT MAP */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-[#dc2626]">
                <FiBarChart2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-300">Workload Heat Map</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Priority distribution</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">{totalContracts}</div>
              <p className="text-[10px] text-gray-500">contracts</p>
            </div>
          </div>
          
          {/* Grouped Stacked Bar Chart */}
          <div>
            {/* Summary Row */}
            <div className="grid grid-cols-4 gap-2">
              {priorityData.map((priority, idx) => {
                return (
                  <div key={idx} className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded p-2 text-center hover:bg-white/[0.04] transition-all">
                    <div 
                      className="w-3 h-3 rounded-sm mx-2" 
                      style={{ backgroundColor: priority.color }}
                    />
                    <p className="text-[9px] font-medium text-gray-300 capitalize">{priority.label} ({priority.count})</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KPI 2: COMPLEXITY INDEX */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-[#dc2626]">
                <FiUsers className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-300">Complexity Index</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Multi-party contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <div className="w-16 flex flex-col gap-1">
                <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#dc2626] to-[#E11D48]"
                    style={{ width: `${complexityPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400">{data.complexityIndex}/{totalContracts}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{complexityPercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: HIGH-VALUE RATIO */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-yellow-400">
                <FiStar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-300">High-Value Ratio</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Contracts $100K+</p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <div className="w-16 flex flex-col gap-1">
                <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                    style={{ width: `${highValuePercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400">{data.HighvalueContracts}/{totalContracts}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{highValuePercentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 4: TIMELINE & COMPLIANCE */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-purple-400">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-300">Timeline & Compliance</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Contract lifecycle</p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-3">
              <div className="flex gap-2">
                {complianceMetrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div style={{ color: metric.color }}>
                      {metric.icon}
                    </div>
                    <div className="text-xs font-bold text-white mt-1">{metric.value}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{metric.label.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComplianceMonitor;
