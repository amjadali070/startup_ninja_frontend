import React, { useState } from 'react';
import { FiShuffle, FiBarChart2, FiCalendar, FiList } from 'react-icons/fi';
import ContentRepurposer from './ContentRepurposer';
import AnalyticsPanel from './AnalyticsPanel';
import ContentCalendar from './ContentCalendar';
import ScheduledPostsList from './ScheduledPostsList';

const TABS = [
  { key: 'repurpose', label: 'Content Repurposing', icon: FiShuffle },
  { key: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { key: 'calendar', label: 'Content Calendar', icon: FiCalendar },
  { key: 'scheduled', label: 'Scheduled Posts', icon: FiList },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const SocialProPanels: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('repurpose');

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-4 xs:mb-5 sm:mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border ${
                isActive
                  ? 'bg-[#DE0500] border-[#DE0500] text-white'
                  : 'bg-[#1E1E1E] border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'repurpose' && <ContentRepurposer />}
      {activeTab === 'analytics' && <AnalyticsPanel />}
      {activeTab === 'calendar' && <ContentCalendar />}
      {activeTab === 'scheduled' && <ScheduledPostsList />}
    </div>
  );
};

export default SocialProPanels;
