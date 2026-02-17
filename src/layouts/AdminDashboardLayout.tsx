import React from "react";
import { FaUser, FaDollarSign, FaLightbulb, FaFlag } from "react-icons/fa";
import MetricCard from "../components/admin-dashboard/MetricCard";
import RealtimeUsageCard from "../components/admin-dashboard/RealtimeUsageCard";
import AIUsageCard from "../components/admin-dashboard/AIUsageCard";
import SystemAlertsCard from "../components/admin-dashboard/SystemAlertsCard";
import { useAdminDashboard } from "../hooks/useAdminData";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboardLayout: React.FC = () => {
  const { stats, aiUsage, realtimeUsage, alerts, loading, error } =
    useAdminDashboard();

  if (loading) {
    return <LoadingSpinner fullscreen variant="dark" />;
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-400 text-lg">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Map stats to metric cards data
  const metricCardsData = stats
    ? [
        {
          icon: FaUser,
          value: stats.metrics.activeUsers.value,
          trendPercentage: stats.metrics.activeUsers.trendPercentage || "0",
          trendType: (stats.metrics.activeUsers.trendType || "neutral") as
            | "positive"
            | "negative"
            | "neutral",
          label: stats.metrics.activeUsers.label,
        },
        {
          icon: FaDollarSign,
          value: `${stats.metrics.totalUsers.value}`,
          trendPercentage: stats.metrics.newUsers.trendPercentage || "0",
          trendType: (stats.metrics.newUsers.trendType || "neutral") as
            | "positive"
            | "negative"
            | "neutral",
          label: stats.metrics.totalUsers.label,
        },
        {
          icon: FaLightbulb,
          value: stats.metrics.contentGenerated.value,
          trendPercentage:
            stats.metrics.contentGenerated.trendPercentage || "0",
          trendType: (stats.metrics.contentGenerated.trendType || "neutral") as
            | "positive"
            | "negative"
            | "neutral",
          label: stats.metrics.contentGenerated.label,
        },
        {
          icon: FaFlag,
          value: stats.metrics.moderationQueue.value,
          trendPercentage: stats.metrics.moderationQueue.trendPercentage || "0",
          trendType: (stats.metrics.moderationQueue.trendType || "neutral") as
            | "positive"
            | "negative"
            | "neutral",
          label: stats.metrics.moderationQueue.label,
        },
      ]
    : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Top Row - 4 Metric Cards */}
        {metricCardsData.map((metric, index) => (
          <div key={index} className="lg:col-span-1">
            <MetricCard
              icon={metric.icon}
              value={metric.value}
              trendPercentage={metric.trendPercentage}
              trendType={metric.trendType}
              label={metric.label}
            />
          </div>
        ))}

        {/* Middle Row - Left Column: RealtimeUsage + SystemAlerts, Right Column: AIUsage */}
        {/* Left Side Column - RealtimeUsage and SystemAlerts stacked */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-4 lg:gap-6 h-full">
          {/* RealtimeUsageCard */}
          <div className="flex-1">
            {realtimeUsage && (
              <RealtimeUsageCard
                requestsPerSecond={realtimeUsage.requestsPerSecond}
                avgLatency={realtimeUsage.avgLatency}
                errorRate={realtimeUsage.errorRate}
                timeoutPercentage={realtimeUsage.timeoutPercentage}
                chartData={realtimeUsage.chartData}
                timeframeOptions={["This week", "Last week", "This month"]}
                onTimeframeChange={(_) => null}
                selectedTimeframe={realtimeUsage.timeframe || "This week"}
              />
            )}
          </div>

          {/* SystemAlertsCard */}
          <div className="flex-shrink-0">
            <SystemAlertsCard alerts={alerts} />
          </div>
        </div>

        {/* Right Side Column - AIUsageCard */}
        <div className="md:col-span-2 lg:col-span-2 flex">
          <div className="w-full h-full">
            <AIUsageCard models={aiUsage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
