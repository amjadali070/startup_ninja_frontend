import { type FC, useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { planService, Plan } from '../../services/plan';

interface PlansOverviewProps {
    currentPlan: string;
    onSelectPlan: (planName: string) => void;
}

const PlansOverview: FC<PlansOverviewProps> = ({ currentPlan, onSelectPlan }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await planService.getAllPlans();
                if (response.success && response.data) {
                    setPlans(response.data);
                }
            } catch (err) {
                console.error("Failed to load plans", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const getButtonState = (plan: Plan) => {
        const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
        
        // Simple price parsing to determine hierarchy, or use 'key' if ordered
        // Logic: Free < Startup < Pro < Enterprise
        // Using keys: free, startup, pro, enterprise to find index
        // Or using price check
        const order = ['free', 'startup', 'basic', 'pro', 'standard', 'enterprise']; // Added extra keys just in case
        // Normalize key
        const planKey = plan.key || plan.name.toLowerCase().replace(' plan',''); 
        const currentKey = currentPlan.toLowerCase().replace(' plan','');
        
        // Find index logic - robust fallback to price
        let currentIndex = order.indexOf(currentKey);
        let planIndex = order.indexOf(planKey);

        if (currentIndex === -1 || planIndex === -1) {
             // Fallback to price comparison if keys don't match known order
             // Assuming fetchPlans returns sorted by price
             // Need to know current plan price?
             // Simplification: if not current, check if plan.price > 0 and current is Free?
             // Hard to know Upgrade/Downgrade without full context of current plan price.
             // But usually price is the indicator.
        }

        if (isCurrent) {
            return { text: "Current Plan", disabled: true, style: "bg-white/5 text-gray-400 cursor-default border border-white/5" };
        }
        
        // Basic heuristic: Upgrade if plan price > current plan price? 
        // We lack current plan price here unless we find it in the list.
        const currentPlanObj = plans.find(p => p.name.toLowerCase() === currentPlan.toLowerCase() || p.key === currentPlan.toLowerCase());
        const currentPrice = currentPlanObj ? currentPlanObj.price : 0;
        
        if (plan.price > currentPrice) {
             return { 
                 text: "Upgrade", 
                 disabled: false, 
                 style: plan.isPopular 
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 shadow-red-500/10" 
                    : "bg-white text-black hover:bg-gray-200"
            };
        } else {
             return { text: "Downgrade", disabled: false, style: "bg-[#151515] border border-white/10 hover:bg-[#202020] text-gray-300" };
        }
    };

  if (loading) {
      return (
        <section className="rounded-xl border border-white/10 bg-[#151515] p-6 mt-6 animate-pulse">
            <div className="h-6 bg-gray-800 w-48 mb-6 rounded"></div>
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <div key={i} className="h-24 bg-gray-800/50 rounded-lg"></div>
                ))}
            </div>
        </section>
      );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h3 className="text-white text-lg font-bold font-plus-jakarta">Available Plans</h3>
            <p className="text-gray-400 text-sm mt-1">Choose the plan that fits your needs.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const buttonState = getButtonState(plan);
          const interval = plan.price === 0 ? "forever" : "month";
          
          return (
            <div 
                key={plan._id || plan.key} 
                className="group relative rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]"
            >
                <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-4 items-center">
                    
                    {/* Plan Header */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <h4 className="text-white font-bold text-base">{plan.name}</h4>
                            {plan.isPopular && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">
                                    Recommended
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-xl font-bold text-white">${plan.price}</span>
                            {plan.price !== 0 && <span className="text-gray-500 text-xs">/{interval}</span>}
                        </div>
                        <p className="text-gray-400 text-xs mt-1 truncate">{plan.description}</p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/5 pt-3 md:border-0 md:pt-0">
                         {plan.features.slice(0, 4).map((feature, idx) => (
                             <div key={idx} className="flex items-center text-xs text-gray-300">
                                <FaCheck className="w-2.5 h-2.5 text-green-500 mr-2 flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                            </div>
                        ))}
                         {plan.features.length > 4 && (
                            <div className="text-[10px] text-gray-500 italic pl-4.5">
                                + {plan.features.length - 4} more
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end md:justify-end mt-2 md:mt-0">
                        <button
                            onClick={() => onSelectPlan(plan.name)}
                            disabled={buttonState.disabled}
                            className={`w-full md:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${buttonState.style}`}
                        >
                            {buttonState.text}
                        </button>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PlansOverview;
