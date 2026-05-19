import { type FC, useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { planService, Plan } from '../../services/plan';

interface PlansOverviewProps {
    currentPlan: string;
    onSelectPlan: (planName: string) => void;
}

const PlansOverview: FC<PlansOverviewProps> = ({ currentPlan, onSelectPlan }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlanForModal, setSelectedPlanForModal] = useState<Plan | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await planService.getAllPlans();
                if (response.success && response.data) {
                    // Filter out free plan as requested
                    const paidPlans = response.data.filter((p: Plan) => p.price > 0 && p.key !== 'free' && p.name.toLowerCase() !== 'free plan');
                    setPlans(paidPlans);
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
        
        if (isCurrent) {
            return { text: "Current Plan", disabled: true, style: "bg-white/5 text-gray-400 cursor-default border border-white/5" };
        }
        
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
                            <button
                              onClick={() => setSelectedPlanForModal(plan)}
                              className="text-[10px] text-red-500 hover:text-red-400 italic pl-4.5 transition-colors"
                            >
                                + {plan.features.length - 4} more features
                            </button>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end md:justify-end mt-2 md:mt-0">
                        {buttonState.text !== "Downgrade" && (
                            <button
                                onClick={() => onSelectPlan(plan.name)}
                                disabled={buttonState.disabled}
                                className={`w-full md:w-auto px-4 py-2 rounded-lg text-xs font-bold transition-all ${buttonState.style}`}
                            >
                                {buttonState.text}
                            </button>
                        )}
                        {/* Downgrade button hidden as requested */}
                    </div>
                </div>
            </div>
          );
        })}
      </div>

      {/* Plan Details Modal */}
      {selectedPlanForModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151515] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#151515] border-b border-white/10 p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-white text-xl font-bold font-plus-jakarta">{selectedPlanForModal.name}</h2>
                  {selectedPlanForModal.isPopular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">{selectedPlanForModal.description}</p>
              </div>
              <button
                onClick={() => setSelectedPlanForModal(null)}
                className="text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Close modal"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Price Section */}
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">${selectedPlanForModal.price}</span>
                  {selectedPlanForModal.price !== 0 && (
                    <span className="text-gray-400">/month</span>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-white font-bold mb-4">All Features ({selectedPlanForModal.features.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlanForModal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Limits Section - if available */}
              {selectedPlanForModal.limits && Object.keys(selectedPlanForModal.limits).length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-white font-bold mb-4">Plan Limits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedPlanForModal.limits).map(([key, value]: [string, any], idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                        <p className="text-lg font-bold text-white mt-1">
                          {value === -1 ? 'Unlimited' : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="border-t border-white/10 pt-6">
                <button
                  onClick={() => {
                    onSelectPlan(selectedPlanForModal.name);
                    setSelectedPlanForModal(null);
                  }}
                  disabled={selectedPlanForModal.name.toLowerCase() === currentPlan.toLowerCase()}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    selectedPlanForModal.name.toLowerCase() === currentPlan.toLowerCase()
                      ? 'bg-white/5 text-gray-400 cursor-default border border-white/5'
                      : selectedPlanForModal.isPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'
                      : 'bg-white hover:bg-gray-200 text-black'
                  }`}
                >
                  {selectedPlanForModal.name.toLowerCase() === currentPlan.toLowerCase() ? 'Current Plan' : 'Select This Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlansOverview;
