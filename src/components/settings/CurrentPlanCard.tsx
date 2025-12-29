import { type FC, useEffect, useState } from 'react';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';

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
  onUpgradePlan: () => void;
  onViewBillingHistory: () => void;
  onCancelSubscription: () => void;
}

const CurrentPlanCard: FC<CurrentPlanCardProps> = ({
  onUpgradePlan,
  onViewBillingHistory,
  onCancelSubscription,
}) => {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<PlanDetails>({
    name: 'Loading...',
    price: '$0.00',
    status: 'active',
    renewalDate: '-',
    tokensUsed: 0,
    tokensLimit: 100,
    tokensRemaining: 0
  });

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const res: any = await authService.getSubscription();
      if (res.success && res.data) {
        const { plan: planName, nextBillingDate, limits, usage, status } = res.data;
        
        // Map backend data to UI model
        setPlan({
          name: planName || 'Free Plan', // Fallback
          price: planName === 'Free' ? '$0.00' : (planName === 'Startup' ? '$9.00' : (planName === 'Pro' ? '$29.00' : '$99.00')),
          status: status || 'active',
          renewalDate: nextBillingDate 
            ? new Date(nextBillingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : 'N/A',
          tokensUsed: usage?.ai_chat_messages || 0,
          tokensLimit: limits?.ai_chat_messages || 10,
          tokensRemaining: Math.max(0, (limits?.ai_chat_messages || 10) - (usage?.ai_chat_messages || 0))
        });
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      toast.error('Could not load plan details');
    } finally {
      setLoading(false);
    }
  };

  const tokensPercentage = Math.min(100, Math.max(0, (plan.tokensUsed / plan.tokensLimit) * 100));

  if (loading) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#151515] p-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-1/4"></div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
        <div className="text-gray-400 text-xs xs:text-sm">Current Plan</div>
        <div className="bg-[#00E01A0D] text-[#00E01A] text-xs font-medium px-2 py-1 rounded border border-[#00E01A80] capitalize">
          {plan.status}
        </div>
      </div>

      {/* Plan Details */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-sm">{plan.price} / month</p>
      </div>

      {/* Plan Summary */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h4 className="text-white text-sm xs:text-base font-bold font-plus-jakarta mb-2">Plan Summary</h4>
        <p className="text-gray-400 text-xs xs:text-sm mb-3 xs:mb-4">
            {plan.name === 'Free' ? 'Free Forever' : `Renews on ${plan.renewalDate}`}
        </p>
        
        {/* AI Tokens Section */}
        <div>
          <div className="text-gray-400 text-xs xs:text-sm mb-2">AI Chat Messages</div>
          <div className="relative">
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${tokensPercentage > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${tokensPercentage}%` }}
              />
            </div>
            
            {/* Usage Stats */}
            <div className="flex justify-between items-start">
              <div></div>
              <div className="text-right">
                <div className="text-white text-xs xs:text-sm font-medium">
                  {plan.tokensUsed.toLocaleString()} / {plan.tokensLimit === 999999 ? 'Unlimited' : plan.tokensLimit.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">
                  {plan.tokensLimit === 999999 ? '∞' : plan.tokensRemaining.toLocaleString()} Remaining
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
        {plan.name !== 'Free' && (
            <button
            type="button"
            onClick={onCancelSubscription}
            className="flex items-center justify-center xs:justify-start gap-1 text-gray-400 text-xs xs:text-sm underline hover:text-white transition-colors"
            >
            Cancel Subscription
            <FaArrowRight className="w-3 h-3" />
            </button>
        )}
      </div>
    </section>
  );
};

export default CurrentPlanCard;
