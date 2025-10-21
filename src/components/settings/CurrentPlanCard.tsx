import { type FC } from 'react';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

export type PlanDetails = {
  name: string;
  price: string;
  status: 'active' | 'inactive' | 'cancelled';
  renewalDate: string;
  tokensUsed: number;
  tokensLimit: number;
  tokensRemaining: number;
};

interface CurrentPlanCardProps {
  plan: PlanDetails;
  onUpgradePlan: () => void;
  onViewBillingHistory: () => void;
  onCancelSubscription: () => void;
}

const CurrentPlanCard: FC<CurrentPlanCardProps> = ({
  plan,
  onUpgradePlan,
  onViewBillingHistory,
  onCancelSubscription,
}) => {
  const tokensPercentage = (plan.tokensUsed / plan.tokensLimit) * 100;

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
        <div className="text-gray-400 text-xs xs:text-sm">Current Plan</div>
        <div className="bg-[#00E01A0D] text-[#00E01A] text-xs font-medium px-2 py-1 rounded border border-[#00E01A80]">
          Active
        </div>
      </div>

      {/* Plan Details */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-sm">{plan.price}</p>
      </div>

      {/* Plan Summary */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h4 className="text-white text-sm xs:text-base font-bold font-plus-jakarta mb-2">Plan Summary</h4>
        <p className="text-gray-400 text-xs xs:text-sm mb-3 xs:mb-4">{plan.renewalDate}</p>
        
        {/* AI Tokens Section */}
        <div>
          <div className="text-gray-400 text-xs xs:text-sm mb-2">AI Tokens</div>
          <div className="relative">
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${tokensPercentage}%` }}
              />
            </div>
            
            {/* Usage Stats */}
            <div className="flex justify-between items-start">
              <div></div>
              <div className="text-right">
                <div className="text-white text-xs xs:text-sm font-medium">
                  {plan.tokensUsed.toLocaleString()} / {plan.tokensLimit.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">
                  {plan.tokensRemaining.toLocaleString()} Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 xs:space-y-3">
        {/* Primary Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <button
            type="button"
            onClick={onUpgradePlan}
            className="flex items-center justify-center gap-2 px-3 xs:px-4 py-2.5 xs:py-3.5 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#FF1A1A] hover:to-[#A00000] text-white text-xs xs:text-sm font-bold rounded-lg transition-all duration-200"
          >
            <FaRocket className="w-3 h-3 xs:w-4 xs:h-4" />
            Upgrade Plan
          </button>
          <button
            type="button"
            onClick={onViewBillingHistory}
            className="px-3 xs:px-4 py-2.5 xs:py-3.5 bg-[#FFFFFF0D] border border-[#FFFFFF1A] hover:bg-[#2A2A2A] text-white text-xs xs:text-sm font-medium rounded-lg transition-colors"
          >
            View Billing History
          </button>
        </div>
        
        {/* Cancel Subscription Link */}
        <button
          type="button"
          onClick={onCancelSubscription}
          className="flex items-center justify-center xs:justify-start gap-1 text-gray-400 text-xs xs:text-sm underline hover:text-white transition-colors"
        >
          Cancel Subscription
          <FaArrowRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
};

export default CurrentPlanCard;
