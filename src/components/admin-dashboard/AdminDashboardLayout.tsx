import React from 'react';
import { FaUser, FaDollarSign, FaLightbulb, FaFlag } from 'react-icons/fa';
import MetricCard from './MetricCard';
import RealtimeUsageCard from './RealtimeUsageCard';
import AIUsageCard from './AIUsageCard';
import SystemAlertsCard from './SystemAlertsCard';

const AdminDashboardLayout: React.FC = () => {
  // Sample data for MetricCards
  const metricCardsData = [
    {
      icon: FaUser,
      value: '12,847',
      trendPercentage: '8.2',
      trendType: 'positive' as const,
      label: 'Active Users (24h)',
    },
    {
      icon: FaDollarSign,
      value: '$412,847',
      trendPercentage: '22.1',
      trendType: 'positive' as const,
      label: 'MRR',
    },
    {
      icon: FaLightbulb,
      value: '3,456',
      trendPercentage: '15.3',
      trendType: 'positive' as const,
      label: 'Content Generated',
    },
    {
      icon: FaFlag,
      value: '23',
      trendPercentage: '22.1',
      trendType: 'negative' as const,
      label: 'Moderation Queue',
    },
  ];

  // Sample data for RealtimeUsageCard
  const realtimeUsageData = {
    requestsPerSecond: '245/sec',
    avgLatency: '89ms',
    errorRate: '0.8%',
    timeoutPercentage: '78%',
    chartData: [60, 40, 70, 30, 80, 50, 65, 35, 90, 45, 75, 95],
    timeframeOptions: ['This week', 'Last week', 'This month'],
    selectedTimeframe: 'This week',
    onTimeframeChange: (timeframe: string) => console.log('Timeframe changed to:', timeframe),
  };

  // Sample data for AIUsageCard (ModelUsageCard)
  const aiUsageData = [
    {
      name: 'GPT-4 Turbo',
      tokens: '2.1M tokens',
      cost: '$1,275',
      percentage: 45,
    },
    {
      name: 'DALL-E 3',
      tokens: '856K tokens',
      cost: '$892',
      percentage: 28,
    },
    {
      name: 'Claude 3',
      tokens: '645K tokens',
      cost: '$578',
      percentage: 18,
    },
    {
      name: 'Midjourney',
      tokens: '234K tokens',
      cost: '$312',
      percentage: 9,
    },
    {
      name: 'Gemini',
      tokens: '2344K tokens',
      cost: '$912',
      percentage: 50,
    },
  ];

  // Sample data for SystemAlertsCard
  const systemAlertsData = [
    {
      id: '1',
      message: 'API rate limit approaching threshold',
      timestamp: '2 mins ago',
    },
    {
      id: '2',
      message: '3 users near quota breach',
      timestamp: '15 mins ago',
    },
    {
      id: '3',
      message: 'Payment retry failed for Acme Corp',
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      message: 'Moderation backlog over SLA (7 items)',
      timestamp: '15 mins ago',
    },
    {
      id: '5',
      message: 'High error rate on /generate (0.9% > 0.5%)',
      timestamp: '1 hour ago',
    },
  ];

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
            <RealtimeUsageCard
              requestsPerSecond={realtimeUsageData.requestsPerSecond}
              avgLatency={realtimeUsageData.avgLatency}
              errorRate={realtimeUsageData.errorRate}
              timeoutPercentage={realtimeUsageData.timeoutPercentage}
              chartData={realtimeUsageData.chartData}
              timeframeOptions={realtimeUsageData.timeframeOptions}
              onTimeframeChange={realtimeUsageData.onTimeframeChange}
              selectedTimeframe={realtimeUsageData.selectedTimeframe}
            />
          </div>
          
          {/* SystemAlertsCard */}
          <div className="flex-shrink-0">
            <SystemAlertsCard alerts={systemAlertsData} />
          </div>
        </div>

        {/* Right Side Column - AIUsageCard */}
        <div className="md:col-span-2 lg:col-span-2 flex">
          <div className="w-full h-full">
            <AIUsageCard models={aiUsageData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;