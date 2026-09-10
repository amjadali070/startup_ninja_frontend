import { type FC, useMemo, useState } from 'react';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import PlanDetails, { PlanLimits, PlanUsage } from './PlanDetails';
import AlertModal from '../AlertModal';
import { Plan } from '../../services/plan';
import { useUserTimezone } from '../../hooks/useUserTimezone';

// Define the subscription data interface matching what's passed from parent
interface SubscriptionData {
  plan: string;
  planId?: string;
  status: 'active' | 'inactive' | 'cancelled';
  cancelAtPeriodEnd?: boolean;
  price?: number;
  currency?: string;
  nextBillingDate?: string;
  usage?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    ai_post_writer?: number;
    chat_bot_messages?: number;
    facebook_page_connect?: number;
    web_builder_sessions?: number;
    websites: number;
    website_creation?: number;
    sales_leads?: number;
    sales_projects?: number;
    legal_contracts?: number;
    legal_contract_section_revisions?: number;
    team_members?: number;
    [key: string]: number | undefined;
  };
  limits?: {
    ai_chat_messages: number;
    generated_images: number;
    social_posts: number;
    ai_post_writer?: number;
    chat_bot_messages?: number;
    facebook_page_connect?: number;
    web_builder_sessions?: number;
    websites: number;
    website_creation?: number;
    website_hosting?: number;
    sales_leads?: number;
    sales_projects?: number;
    legal_contracts?: number;
    legal_contract_section_revisions?: number;
    team_members?: number;
    [key: string]: number | undefined;
  };
  scheduledDowngrade?: { planKey: string; effectiveDate: string } | null;
}

export type PlanDetailsType = {
  name: string;
  price: string;
  status: 'active' | 'inactive' | 'cancelled';
  isCanceling?: boolean;
  renewalDate: string;
  usage: PlanUsage;
  limits: PlanLimits;
  scheduledDowngrade?: { planKey: string; effectiveDate: string } | null;
};

interface CurrentPlanCardProps {
  subscription: SubscriptionData | null;
  plans?: Plan[];
  onUpgradePlan: () => void;
  onViewBillingHistory: () => void;
  onCancelSubscription: () => Promise<void> | void;
  onCancelScheduledDowngrade?: () => Promise<void> | void;
}

const CurrentPlanCard: FC<CurrentPlanCardProps> = ({
  subscription,
  plans = [],
  onUpgradePlan,
  onViewBillingHistory,
  onCancelSubscription,
  onCancelScheduledDowngrade,
}) => {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  const [isProcessingDowngradeCancel, setIsProcessingDowngradeCancel] = useState(false);
  const { ianaTimezone } = useUserTimezone();

  const planDetails: PlanDetailsType | null = useMemo(() => {
    if (!subscription) return null;

    // Map backend data to UI model
    const planName = subscription.plan;

    // Price logic - dynamic
    let price = subscription.price !== undefined
        ? `${subscription.currency === 'USD' || !subscription.currency ? '$' : subscription.currency}${subscription.price.toFixed(2)}`
        : '$0.00';

    if (plans.length > 0) {
        const matchedPlan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase() || p.key === planName.toLowerCase() || p.key === subscription.planId);
        if (matchedPlan) {
            price = `$${matchedPlan.price.toFixed(2)}`;
        }
    } else if (subscription.price === undefined) {
        // Fallback when live plan data hasn't loaded yet
        const key = planName.toLowerCase();
        if (key === 'go') price = '$15.00';
        else if (key === 'go_student' || key === 'go student') price = '$10.00';
        else if (key === 'pro') price = '$39.00';
        else if (key === 'business') price = '$99.00';
    }

    // Real IANA timezone (from the user's saved preference), not the
    // browser's implicit local timezone — feedback.md §10.
    let renewalDate = 'N/A';
    if (subscription.nextBillingDate) {
      const nextBillingDateObj = new Date(subscription.nextBillingDate);
      if (!Number.isNaN(nextBillingDateObj.getTime())) {
        renewalDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: ianaTimezone }).format(nextBillingDateObj);
      }
    }

    return {
      name: planName || 'Free Plan',
      price: price,
      status: subscription.status || 'active',
      isCanceling: subscription.cancelAtPeriodEnd,
      scheduledDowngrade: subscription.scheduledDowngrade,
      renewalDate,
      usage: {
        ai_chat_messages: subscription.usage?.ai_chat_messages || 0,
        ai_post_writer: subscription.usage?.ai_post_writer || 0,
        generated_images: subscription.usage?.generated_images || 0,
        chat_bot_messages: subscription.usage?.chat_bot_messages || 0,
        social_posts: subscription.usage?.social_posts || 0,
        facebook_page_connect: subscription.usage?.facebook_page_connect || 0,
        web_builder_sessions: subscription.usage?.web_builder_sessions || 0,
        websites: subscription.usage?.websites || 0,
        website_creation: subscription.usage?.website_creation || 0,
        legal_contracts: subscription.usage?.legal_contracts || 0,
        legal_contract_section_revisions: subscription.usage?.legal_contract_section_revisions || 0,
        team_members: subscription.usage?.team_members || 0,
        sales_leads: subscription.usage?.sales_leads || 0,
        sales_projects: subscription.usage?.sales_projects || 0,
      },
      limits: {
        ...(subscription.limits || {}),
        ai_chat_messages: subscription.limits?.ai_chat_messages || 10,
        ai_post_writer: subscription.limits?.ai_post_writer || 5,
        generated_images: subscription.limits?.generated_images || 5,
        chat_bot_messages: subscription.limits?.chat_bot_messages || 0,
        social_posts: subscription.limits?.social_posts || 10,
        facebook_page_connect: subscription.limits?.facebook_page_connect || 1,
        web_builder_sessions: subscription.limits?.web_builder_sessions || 3,
        websites: subscription.limits?.website_creation ?? subscription.limits?.website_hosting ?? subscription.limits?.websites ?? 1,
        legal_contracts: subscription.limits?.legal_contracts || 0,
        legal_contract_section_revisions: subscription.limits?.legal_contract_section_revisions || 0,
        team_members: subscription.limits?.team_members || 0,
        sales_leads: subscription.limits?.sales_leads || 0,
        sales_projects: subscription.limits?.sales_projects || 0,
      }
    };
  }, [subscription, plans, ianaTimezone]);

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

  const handleCancelScheduledDowngrade = async () => {
      if (!onCancelScheduledDowngrade) return;
      setIsProcessingDowngradeCancel(true);
      try {
          await onCancelScheduledDowngrade();
      } catch (error) {
          console.error("Cancel scheduled downgrade failed", error);
      } finally {
          setIsProcessingDowngradeCancel(false);
      }
  };

  return (
    <>
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-1 xs:mb-1 sm:mb-1">
        <div className="text-gray-400 text-xs xs:text-sm">Current Plan</div>
        <div className={`text-xs font-medium px-2 py-1 rounded border capitalize ${badgeClass}`}>
          {statusText}
        </div>
      </div>

      {/* Plan Details */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">{planDetails.name}</h3>
        <p className="text-gray-400 text-sm">{planDetails.price} / month</p>

        {planDetails.scheduledDowngrade && (
          <div className="mt-3 flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
            <p className="text-amber-400 text-xs xs:text-sm flex-1">
              Your plan will change to <span className="font-semibold">{planDetails.scheduledDowngrade.planKey}</span> on {planDetails.renewalDate}.
            </p>
            {onCancelScheduledDowngrade && (
              <button
                type="button"
                onClick={handleCancelScheduledDowngrade}
                disabled={isProcessingDowngradeCancel}
                className="text-xs xs:text-sm text-amber-400 underline hover:text-amber-300 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isProcessingDowngradeCancel ? "Cancelling…" : "Keep current plan"}
              </button>
            )}
          </div>
        )}
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
