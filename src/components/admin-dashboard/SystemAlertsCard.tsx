import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

type AlertItem = {
  id: string;
  message: string;
  timestamp: string;
};

interface SystemAlertsCardProps {
  alerts: AlertItem[];
}

const SystemAlertsCard: React.FC<SystemAlertsCardProps> = ({ alerts }) => {
  return (
    <div className="w-full bg-[#1A1A1A] rounded-xl p-4 sm:p-5">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-600 rounded-lg p-2 flex items-center justify-center">
          <FaExclamationTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h3 className="text-white text-lg sm:text-xl font-bold font-plus-jakarta">
          System Alerts
        </h3>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 sm:space-y-3.5">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start justify-between gap-4">
            {/* Alert Message */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm sm:text-base font-medium leading-relaxed break-words">
                {alert.message}
              </p>
            </div>
            
            {/* Timestamp */}
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                {alert.timestamp}
              </span>
            </div>
          </div>
        ))}
        
        {/* Empty state */}
        {alerts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm sm:text-base">
              No system alerts at this time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemAlertsCard;
export { SystemAlertsCard };