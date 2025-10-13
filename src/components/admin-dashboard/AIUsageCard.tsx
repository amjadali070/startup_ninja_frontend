import React from 'react';

interface AIModel {
  name: string;
  tokens: string;
  cost: string;
  percentage: number;
}

interface AIUsageCardProps {
  models: AIModel[];
}

const AIUsageCard: React.FC<AIUsageCardProps> = ({ models }) => {
  return (
    <div className="w-full h-full bg-[#1A1A1A] rounded-xl p-4 sm:p-6 flex flex-col">
      {/* Header Section */}
      <div className="mb-4">
        <h3 className="text-white text-lg sm:text-xl font-bold font-plus-jakarta">
          Realtime Usage
        </h3>
      </div>

      {/* AI Models List */}
      <div className="space-y-5 sm:space-y-7 flex-1 flex flex-col justify-center">
        {models.map((model, index) => (
          <div key={index} className="space-y-3">
            {/* Model name and cost row */}
            <div className="flex items-center justify-between">
              <h4 className="text-white text-base sm:text-lg font-semibold">
                {model.name}
              </h4>
              <span className="text-white text-base sm:text-lg font-semibold">
                {model.cost}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 sm:h-3">
              <div 
                className="bg-[#DE0500] h-3 sm:h-3 rounded-full transition-all duration-300"
                style={{ width: `${model.percentage}%` }}
              />
            </div>
            
            {/* Tokens and percentage row */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs sm:text-sm">
                {model.tokens}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm">
                {model.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIUsageCard;
export { AIUsageCard };