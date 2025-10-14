import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface MetricCardProps {
  icon: React.ElementType;
  value: string | number;
  trendPercentage: string | number;
  trendType: 'positive' | 'negative' | 'neutral';
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  value,
  trendPercentage,
  trendType,
  label,
}) => {
  // Get trend styling based on type
  const getTrendStyling = () => {
    switch (trendType) {
      case 'positive':
        return {
          textColor: 'text-green-400',
          icon: <FaArrowUp className="w-2 h-2 sm:w-2.5 sm:h-2.5" />,
        };
      case 'negative':
        return {
          textColor: 'text-red-400',
          icon: <FaArrowDown className="w-2 h-2 sm:w-2.5 sm:h-2.5" />,
        };
      case 'neutral':
      default:
        return {
          textColor: 'text-gray-400',
          icon: null,
        };
    }
  };

  const trendStyling = getTrendStyling();

  return (
    <div className="w-full max-w-auto mx-auto bg-[#151515] border-[1.96px] border-[#242424] rounded-[9.76px] p-3 sm:p-4 opacity-100 min-h-[160px] sm:min-h-[180px] flex flex-col justify-between">
      {/* Icon at top-left */}
      <div className="m-2 sm:m-3">
        <Icon 
          className="w-5 h-5 sm:w-7 sm:h-7"
          style={{
           color: '#DC2626',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        />
      </div>

      {/* Value and Trend container */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2 mb-2 sm:mb-3 flex-grow">
        {/* Main Value */}
        <span className="text-white text-xl sm:text-2xl font-bold leading-tight">
          {value}
        </span>

        {/* Trend Badge */}
        <div 
          className={`${trendStyling.textColor} rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 flex items-center gap-1 text-xs self-start sm:self-end`}
          style={{ background: '#102418' }}
        >
          {trendStyling.icon}
          <span>+{trendPercentage}%</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-gray-400 text-sm sm:text-base font-medium leading-tight">
        {label}
      </div>
    </div>
  );
};

export default MetricCard;
export { MetricCard };