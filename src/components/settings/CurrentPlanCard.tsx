import { type FC, useMemo, useState } from 'react';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import PlanDetails, { PlanLimits, PlanUsage } from './PlanDetails';
import AlertModal from '../AlertModal';

// Define the subscription data interface matching what's passed from parent
interface SubscriptionData {
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  cancelAtPeriodEnd?: boolean;
  nextBillingDate?: string;
  usage?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    websites: number;
  };
  limits?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    websites: number;
  };
}

export type PlanDetailsType = {
  name: string;
  price: string;
  status: 'active' | 'inactive' | 'cancelled';
  isCanceling?: boolean;
  renewalDate: string;
  usage: PlanUsage;
  limits: PlanLimits;
};

interface CurrentPlanCardProps {
  subscription: SubscriptionData | null;
  onUpgradePlan: () => void;
  onViewBillingHistory: () => void;
  onCancelSubscription: () => Promise<void> | void;
}

const CurrentPlanCard: FC<CurrentPlanCardProps> = ({
  subscription,
  onUpgradePlan,
  onViewBillingHistory,
  onCancelSubscription,
}) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  
  const planDetails: PlanDetailsType | null = useMemo(() => {
    if (!subscription) return null;

    // Map backend data to UI model
    const planName = subscription.plan;
    
    // Price logic - simplified for now
    let price = '$0.00';
    if (planName === 'Startup') price = '$9.00';
    else if (planName === 'Pro') price = '$29.00';
    else if (planName === 'Enterprise') price = '$99.00';

    return {
      name: planName || 'Free Plan',
      price: price,
      status: subscription.status || 'active',
      isCanceling: subscription.cancelAtPeriodEnd,
      renewalDate: subscription.nextBillingDate 
        ? new Date(subscription.nextBillingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A',
      usage: subscription.usage || { ai_chat_messages: 0, generated_images: 0, social_posts: 0, websites: 0 },
      limits: subscription.limits || { ai_chat_messages: 10, generated_images: 5, social_posts: 10, websites: 1 }
    };
  }, [subscription]);

  // Loading state if subscription data hasn't arrived
  if (!planDetails) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#151515] p-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-1/4"></div>
      </section>
    );
  }

  // Determine badge style
  let badgeClass = "bg-[#00E01A0D] text-[#00E01A] border-[#00E01A80]";
  let statusText: string = planDetails.status;

  if (planDetails.isCanceling) {
      badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/50";
      statusText = "Cancels Soon";
  } else if (planDetails.status === 'inactive' || planDetails.status === 'cancelled') {
      badgeClass = "bg-gray-500/10 text-gray-400 border-gray-500/50";
  }

  const handleConfirmCancel = async () => {
      setIsProcessingCancel(true);
      try {
          await onCancelSubscription();
          setShowCancelAlert(false);
      } catch (error) {
          console.error("Cancel failed", error);
      } finally {
          setIsProcessingCancel(false);
      }
  };

  return (
    <>
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
        <div className="text-gray-400 text-xs xs:text-sm">Current Plan</div>
        <div className={`text-xs font-medium px-2 py-1 rounded border capitalize ${badgeClass}`}>
          {statusText}
        </div>
      </div>

      {/* Plan Details */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">{planDetails.name}</h3>
        <p className="text-gray-400 text-sm">{planDetails.price} / month</p>
      </div>

      {/* Plan Summary */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h4 className="text-white text-sm xs:text-base font-bold font-plus-jakarta mb-2">Plan Summary</h4>
        <p className="text-gray-400 text-xs xs:text-sm mb-3 xs:mb-4">
            {planDetails.name === 'Free' 
                ? 'Free Forever' 
                : planDetails.isCanceling 
                    ? `Access ends on ${planDetails.renewalDate}`
                    : `Renews on ${planDetails.renewalDate}`
            }
        </p>
        
        {/* Usages from PlanDetails */}
        <PlanDetails usage={planDetails.usage} limits={planDetails.limits} />
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
        
        {/* Cancel Subscription Link (Hide if already canceling or Free) */}
        {planDetails.name !== 'Free' && !planDetails.isCanceling && planDetails.status === 'active' && (
            <button
            type="button"
            onClick={() => setShowCancelAlert(true)}
            className="flex items-center justify-center xs:justify-start gap-1 text-gray-400 text-xs xs:text-sm underline hover:text-white transition-colors"
            >
            Cancel Subscription
            <FaArrowRight className="w-3 h-3" />
            </button>
        )}
      </div>
    </section>

    {/* Cancel Confirmation Modal */}
    <AlertModal
        isOpen={showCancelAlert}
        onClose={() => setShowCancelAlert(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? It will remain active until the end of the billing period, but will not renew."
        type="danger"
        action="delete"
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        isLoading={isProcessingCancel}
        loadingText="Cancelling..."
    />
    </>
  );
};

export default CurrentPlanCard;
