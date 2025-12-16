import React from "react";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { FiCode } from "react-icons/fi";
import { AIModel as AdminAIModel } from "../../types/admin";

interface EnhancedAIModel extends AdminAIModel {
  icon?: React.ElementType;
  color?: string;
  bgGradient?: string;
}

interface AIUsageCardProps {
  models?: AdminAIModel[];
}

const AIUsageCard: React.FC<AIUsageCardProps> = () => {
  // Static data for the three models
  const staticModels: EnhancedAIModel[] = [
    {
      name: "OpenAI",
      icon: SiOpenai,
      tokens: "2.5M Tokens",
      cost: "$45.80",
      percentage: 65,
      color: "text-white",
      bgGradient: "from-gray-800/50 to-gray-900/50",
    },
    {
      name: "Google Gemini",
      icon: SiGoogle,
      tokens: "1.8M Tokens",
      cost: "$28.50",
      percentage: 45,
      color: "text-white",
      bgGradient: "from-gray-800/50 to-gray-900/50",
    },
    {
      name: "GrapesJS",
      icon: FiCode,
      tokens: "850K Requests",
      cost: "$12.30",
      percentage: 25,
      color: "text-white",
      bgGradient: "from-gray-800/50 to-gray-900/50",
    },
  ];

  // Always use static data
  const displayModels: EnhancedAIModel[] = staticModels;

  return (
    <div className="w-full h-full bg-[#1A1A1A] rounded-xl p-4 sm:p-6 flex flex-col border border-white/5">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg sm:text-xl font-bold font-plus-jakarta">
            AI Model Usage
          </h3>
          <div className="px-3 py-1 bg-[#DE0500]/10 border border-[#DE0500]/30 rounded-full">
            <span className="text-[#DE0500] text-xs font-semibold">Live</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Real-time API consumption
        </p>
      </div>

      {/* AI Models List */}
      <div className="space-y-4 sm:space-y-5 flex-1 flex flex-col justify-center">
        {displayModels.map((model, index) => {
          const IconComponent = model.icon || FiCode;
          return (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-lg p-4 border border-white/10"
            >
              {/* Model name and cost row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black/30 flex items-center justify-center ${
                      model.color || "text-gray-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-white text-base sm:text-lg font-semibold">
                    {model.name}
                  </h4>
                </div>
                <span
                  className={`${
                    model.color || "text-gray-400"
                  } text-base sm:text-lg font-bold`}
                >
                  {model.cost}
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative w-full bg-black/40 rounded-full h-2 sm:h-2.5 mb-2 overflow-hidden">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: `${model.percentage}%`,
                    background:
                      "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                  }}
                ></div>
              </div>

              {/* Tokens and percentage row */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs sm:text-sm font-medium">
                  {model.tokens}
                </span>
                <span
                  className={`${
                    model.color || "text-gray-400"
                  } text-xs sm:text-sm font-semibold`}
                >
                  {model.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-400">Total Usage</span>
          <span className="text-white font-semibold">
            $
            {displayModels
              .reduce((sum, m) => sum + parseFloat(m.cost.replace("$", "")), 0)
              .toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIUsageCard;
export { AIUsageCard };
