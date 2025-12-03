import React from "react";
import {
  FaDesktop,
  FaUser,
  FaCreditCard,
  FaImage,
  FaShieldAlt,
} from "react-icons/fa";

interface TabNavigationProps {
  activeTab: "overview" | "profile" | "subscription" | "content" | "security";
  onTabChange: (
    tab: "overview" | "profile" | "subscription" | "content" | "security"
  ) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: FaDesktop },
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "subscription", label: "Subscription", icon: FaCreditCard },
    { id: "content", label: "Content", icon: FaImage },
    { id: "security", label: "Security & Logs", icon: FaShieldAlt },
  ] as const;

  return (
    <div className="flex overflow-x-auto border-b border-[#242424] mb-6 gap-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
            activeTab === tab.id
              ? "text-red-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <tab.icon />
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-t-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
