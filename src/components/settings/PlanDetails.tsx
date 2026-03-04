import { type FC } from 'react';

export type PlanUsage = {
  ai_chat_messages: number;
  generated_images: number;
  social_posts: number;
  websites?: number;
  website_creation?: number;
};

export type PlanLimits = {
  ai_chat_messages: number;
  generated_images: number;
  social_posts: number;
  websites?: number;
  website_creation?: number;
};

interface PlanDetailsProps {
  usage: PlanUsage;
  limits: PlanLimits;
}

const PlanDetails: FC<PlanDetailsProps> = ({ usage, limits }) => {
  const renderUsageItem = (label: string, used: number, limit: number) => {
    // Handle unlimited limits (e.g. 999999 or -1)
    const isUnlimited = limit >= 999999 || limit === -1;
    const percentage = isUnlimited ? 0 : Math.min(100, Math.max(0, (used / limit) * 100));
    
    return (
      <div className="mb-2 last:mb-0">
        <div className="flex justify-between items-end mb-2">
            <span className="text-gray-400 text-xs xs:text-sm">{label}</span>
            <div className="text-right">
                <span className="text-white text-xs xs:text-sm font-medium">
                  {used.toLocaleString()} / {isUnlimited ? 'Unlimited' : limit.toLocaleString()}
                </span>
            </div>
        </div>
        <div className="relative w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${isUnlimited ? 5 : percentage}%` }}
          />
        </div>
        {!isUnlimited && (
            <div className="text-right mt-1">
                 <span className="text-gray-500 text-[10px] xs:text-xs">
                  {Math.max(0, limit - used).toLocaleString()} Remaining
                </span>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-2 pt-2 border-t border-white/10">
      <h4 className="text-white text-sm xs:text-base font-bold font-plus-jakarta mb-4">Usage Details</h4>
      
      {renderUsageItem("AI Chat Messages", usage.ai_chat_messages || 0, limits.ai_chat_messages || 0)}
      {renderUsageItem("Generated Images", usage.generated_images || 0, limits.generated_images || 0)}
      {renderUsageItem("Social Posts", usage.social_posts || 0, limits.social_posts || 0)}
      {renderUsageItem("Websites", (usage.website_creation ?? usage.websites) || 0, (limits.website_creation ?? limits.websites) || 0)}
    </div>
  );
};

export default PlanDetails;
