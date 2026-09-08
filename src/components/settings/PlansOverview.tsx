import { type FC, useEffect, useRef, useState } from 'react';
import { FaCheck, FaRocket, FaTimes } from 'react-icons/fa';
import {
  FiMessageSquare,
  FiImage,
  FiShare2,
  FiGlobe,
  FiFileText,
  FiUsers,
  FiZap,
  FiTrendingUp,
  FiRepeat,
  FiCpu,
  FiLayout,
  FiBarChart2,
} from 'react-icons/fi';
import { planService, Plan } from '../../services/plan';

// ─── Limit label + icon map ───────────────────────────────────────────────────
const LIMIT_META: Record<
  string,
  { label: string; Icon: React.ElementType; color: string }
> = {
  ai_chat_messages:                { label: 'AI Chat Messages',        Icon: FiMessageSquare, color: 'text-sky-400'     },
  ai_post_writer:                  { label: 'AI Post Writer',          Icon: FiZap,           color: 'text-yellow-400'  },
  generated_images:                { label: 'Generated Images',        Icon: FiImage,         color: 'text-purple-400'  },
  social_posts:                    { label: 'Social Posts',            Icon: FiShare2,        color: 'text-pink-400'    },
  chat_bot_messages:               { label: 'Chatbot Messages',        Icon: FiCpu,           color: 'text-teal-400'    },
  facebook_page_connect:           { label: 'Facebook Pages',          Icon: FiShare2,        color: 'text-blue-400'    },
  website_creation:                { label: 'Websites',                Icon: FiGlobe,         color: 'text-emerald-400' },
  website_hosting:                 { label: 'Website Hosting',         Icon: FiLayout,        color: 'text-emerald-400' },
  web_builder_sessions:            { label: 'Web Builder Sessions',    Icon: FiLayout,        color: 'text-indigo-400'  },
  legal_contracts:                 { label: 'Legal Contracts',         Icon: FiFileText,      color: 'text-orange-400'  },
  legal_contract_section_revisions:{ label: 'Contract Revisions',      Icon: FiRepeat,        color: 'text-orange-300'  },
  team_members:                    { label: 'Team Members',            Icon: FiUsers,         color: 'text-rose-400'    },
  sales_leads:                     { label: 'Sales Leads',             Icon: FiTrendingUp,    color: 'text-green-400'   },
  sales_projects:                  { label: 'Sales Projects',          Icon: FiBarChart2,     color: 'text-green-300'   },
};

const formatLimitValue = (_key: string, value: any): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === -1 || value >= 999999) return 'Unlimited';
  if (value === 0) return 'Not included';
  return value.toLocaleString();
};

// ─── Plan Detail Modal ────────────────────────────────────────────────────────
interface PlanDetailModalProps {
  plan: Plan;
  currentPlan: string;
  onClose: () => void;
  onSelectPlan: (name: string) => void;
  onSelectDowngrade?: (name: string) => void;
  isDowngrade: boolean;
}

const PlanDetailModal: FC<PlanDetailModalProps> = ({
  plan,
  currentPlan,
  onClose,
  onSelectPlan,
  onSelectDowngrade,
  isDowngrade,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const limitEntries = Object.entries(plan.limits ?? {}).filter(
    ([key]) => key !== 'single_page_website' && key !== 'multi_page_website'
  );

  const booleanEntries = Object.entries(plan.limits ?? {}).filter(
    ([key]) => key === 'single_page_website' || key === 'multi_page_website'
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex-shrink-0 flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10 bg-[#111111]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-white text-xl font-bold font-plus-jakarta leading-tight">
                {plan.name}
              </h2>
              {plan.isPopular && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  Recommended
                </span>
              )}
              {isCurrent && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-300 uppercase tracking-wider border border-white/10">
                  Current Plan
                </span>
              )}
            </div>
            {plan.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Price banner */}
          <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">
                ${plan.price}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-400 text-sm">/month</span>
              )}
              {plan.price === 0 && (
                <span className="text-gray-400 text-sm">forever</span>
              )}
              {plan.discountPrice !== undefined && plan.discountPrice < plan.price && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${plan.discountPrice}
                </span>
              )}
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">

            {/* ── Features ── */}
            {plan.features.length > 0 && (
              <div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaCheck className="w-3.5 h-3.5 text-green-500" />
                  What's included
                  <span className="text-gray-500 font-normal normal-case tracking-normal">
                    ({plan.features.length} features)
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <FaCheck className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Limits ── */}
            {limitEntries.length > 0 && (
              <div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-3">
                  Plan Limits
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {limitEntries.map(([key, value]) => {
                    const meta = LIMIT_META[key];
                    if (!meta) return null;
                    const { label, Icon, color } = meta;
                    const display = formatLimitValue(key, value);
                    const isUnlimited = display === 'Unlimited';
                    const isNotIncluded = display === 'Not included';

                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isNotIncluded ? 'text-gray-600' : color}`} />
                          <span className="text-gray-400 text-[10px] uppercase tracking-wider font-medium leading-tight">
                            {label}
                          </span>
                        </div>
                        <span
                          className={`text-base font-bold leading-none ${
                            isUnlimited
                              ? 'text-emerald-400'
                              : isNotIncluded
                              ? 'text-gray-600'
                              : 'text-white'
                          }`}
                        >
                          {isUnlimited ? '∞' : display}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Boolean limits (single/multi page website) */}
                {booleanEntries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {booleanEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                          value
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-gray-500 border-white/5'
                        }`}
                      >
                        {value ? (
                          <FaCheck className="w-2.5 h-2.5" />
                        ) : (
                          <FaTimes className="w-2.5 h-2.5" />
                        )}
                        {key === 'single_page_website' ? 'Single-page Website' : 'Multi-page Website'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky footer CTA ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 bg-[#111111]">
          <button
            onClick={() => {
              if (!isCurrent) {
                if (isDowngrade && onSelectDowngrade) {
                  onSelectDowngrade(plan.name);
                } else {
                  onSelectPlan(plan.name);
                }
                onClose();
              }
            }}
            disabled={isCurrent}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              isCurrent
                ? 'bg-white/5 text-gray-500 cursor-default border border-white/5'
                : plan.isPopular
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/30'
                : 'bg-white hover:bg-gray-100 text-black'
            }`}
          >
            {!isCurrent && <FaRocket className="w-3.5 h-3.5" />}
            {isCurrent ? 'Your Current Plan' : `Get ${plan.name}`}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Plans Overview ───────────────────────────────────────────────────────────
interface PlansOverviewProps {
  currentPlan: string;
  onSelectPlan: (planName: string) => void;
  onSelectDowngrade?: (planName: string) => void;
}

const getPlanTier = (planName: string): number => {
  const normalized = planName.toLowerCase();
  if (normalized.includes('free')) return 0;
  // Go Student is the same tier as Go (a discounted Go, not a step below it)
  if (normalized.includes('go')) return 1;
  if (normalized.includes('pro')) return 2;
  if (normalized.includes('business')) return 3;
  if (normalized.includes('custom')) return 4;
  return 0;
};

const PlansOverview: FC<PlansOverviewProps> = ({ currentPlan, onSelectPlan, onSelectDowngrade }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planService.getAllPlans();
        if (response.success && response.data) {
          // 'free' is an internal fallback tier (assigned when a subscription
          // lapses/expires), not a marketed product — same filter already
          // applied in PlanSelectionModal/PricingMain/PricingSection.
          const marketedPlans = response.data.filter((p: Plan) => p.key !== 'free');
          const sortedPlans = [...marketedPlans].sort(
            (a: Plan, b: Plan) => a.price - b.price
          );
          setPlans(sortedPlans);
        }
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getButtonState = (plan: Plan) => {
    const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
    if (isCurrent) {
      return {
        text: 'Current Plan',
        disabled: true,
        style: 'bg-white/5 text-gray-400 cursor-default border border-white/5',
      };
    }

    const currentTier = getPlanTier(currentPlan);
    const planTier = getPlanTier(plan.name);

    if (planTier > currentTier) {
      return {
        text: 'Upgrade',
        disabled: false,
        style: plan.isPopular
          ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
          : 'bg-white text-black hover:bg-gray-200',
      };
    }
    return {
      text: 'Downgrade',
      disabled: false,
      style: 'bg-[#151515] border border-white/10 hover:bg-[#202020] text-gray-300',
    };
  };

  if (loading) {
    return (
      <section className="rounded-xl border border-white/10 bg-[#151515] p-6 mt-6 animate-pulse">
        <div className="h-6 bg-gray-800 w-48 mb-6 rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800/50 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-lg font-bold font-plus-jakarta">Available Plans</h3>
            <p className="text-gray-400 text-sm mt-1">
              Click any plan to see full details.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {plans.map((plan) => {
            const buttonState = getButtonState(plan);
            const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();

            return (
              <div
                key={plan._id || plan.key}
                onClick={() => setSelectedPlan(plan)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPlan(plan)}
                aria-label={`View details for ${plan.name} plan`}
                className={`group relative rounded-lg border transition-all duration-200 cursor-pointer outline-none
                  ${isCurrent
                    ? 'border-white/15 bg-white/[0.03]'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  }
                  focus-visible:ring-2 focus-visible:ring-red-500/50`}
              >
                {/* Popular ribbon */}
                {plan.isPopular && (
                  <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                )}

                <div className="p-4 grid grid-cols-1 md:grid-cols-[2fr_3fr_auto] gap-4 items-center">

                  {/* Plan name + price */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-white font-bold text-base">{plan.name}</h4>
                      {plan.isPopular && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                          Recommended
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 uppercase tracking-wider border border-white/10">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white">${plan.price}</span>
                      {plan.price !== 0 && (
                        <span className="text-gray-500 text-xs">/month</span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-1">{plan.description}</p>
                    )}
                  </div>

                  {/* Feature preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 border-t border-white/5 pt-3 md:border-0 md:pt-0">
                    {plan.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-300">
                        <FaCheck className="w-2.5 h-2.5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <span className="text-[10px] text-gray-500 italic pl-4 mt-0.5">
                        +{plan.features.length - 4} more — click to see all
                      </span>
                    )}
                  </div>

                  {/* CTA — stop propagation so clicking the button doesn't double-fire */}
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        if (buttonState.text === 'Downgrade' && onSelectDowngrade) {
                          onSelectDowngrade(plan.name);
                        } else {
                          onSelectPlan(plan.name);
                        }
                      }}
                      disabled={buttonState.disabled}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${buttonState.style}`}
                    >
                      {buttonState.text}
                    </button>
                  </div>
                </div>

                {/* Hover hint */}
                <div className="absolute bottom-2 right-3 text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors pointer-events-none select-none">
                  View details →
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          currentPlan={currentPlan}
          onClose={() => setSelectedPlan(null)}
          onSelectPlan={onSelectPlan}
          onSelectDowngrade={onSelectDowngrade}
          isDowngrade={getPlanTier(selectedPlan.name) <= getPlanTier(currentPlan) && selectedPlan.name.toLowerCase() !== currentPlan.toLowerCase()}
        />
      )}
    </>
  );
};

export default PlansOverview;
