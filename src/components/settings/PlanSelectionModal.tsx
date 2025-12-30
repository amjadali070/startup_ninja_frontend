import React, { useEffect, useState } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';
import { planService, Plan } from '../../services/plan';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (planName: string) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
        setLoading(true);
        const fetchPlans = async () => {
        try {
            const response = await planService.getAllPlans();
            if (response.success && response.data) {
                // Filter out free plan as requested
                const paidPlans = response.data.filter((p: Plan) => p.price > 0 && p.key !== 'free' && p.name.toLowerCase() !== 'free plan');
                setPlans(paidPlans);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        };
        fetchPlans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getButtonState = (plan: Plan) => {
    const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
    
    // Plan hierarchy order

    
    if (isCurrent) {
      return { 
        text: "Current Plan", 
        disabled: true, 
        style: "bg-[#1A1A1A] text-gray-500 cursor-default border border-white/10" 
      };
    }
    
    const currentPlanObj = plans.find(p => p.name.toLowerCase() === currentPlan.toLowerCase() || p.key === currentPlan.toLowerCase());
    const currentPrice = currentPlanObj ? currentPlanObj.price : 0;

    if (plan.price > currentPrice) {
      return { 
        text: "Upgrade", 
        disabled: false, 
        // White button for Upgrade
        style: "bg-white text-black hover:bg-gray-200 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      };
    } else {
      return { 
        text: "Downgrade", 
        disabled: false, 
        // Dark outline button for Downgrade
        style: "bg-transparent border border-white/10 hover:bg-white/5 text-white" 
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-6xl bg-[#050505] rounded-3xl p-6 lg:p-10 border border-white/10 max-h-[95vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-gray-400 text-base">Select a plan that fits your needs</p>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
        ) : (
            <>
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
                const buttonState = getButtonState(plan);
                const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
                const isRecommended = plan.isPopular;

                // Border color
                let borderColorClass = "border-white/10";
                if (isRecommended) borderColorClass = "border-red-500/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]";

                return (
                <div
                    key={plan._id || plan.key}
                    className={`relative rounded-2xl border bg-[#0A0A0A] p-6 lg:p-8 flex flex-col h-full transition-transform hover:-translate-y-1 duration-300 ${borderColorClass}`}
                >
                    {/* Badges Container - Absolute on top border */}
                    <div className="absolute -top-3 left-0 right-0 flex justify-center items-center gap-2 pointer-events-none">
                        {isRecommended && (
                        <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-[#FF4D4D] text-white uppercase tracking-widest leading-none shadow-lg">
                            Recommended
                        </span>
                        )}
                        {isCurrent && (
                        <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-[#00E01A] text-black uppercase tracking-widest leading-none shadow-lg flex items-center gap-1">
                            <FiCheck size={10} />
                            Current
                        </span>
                        )}
                    </div>

                    {/* Plan Header */}
                    <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm h-10 leading-relaxed">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className="text-4xl xs:text-5xl font-bold text-white tracking-tight">${plan.price}</span>
                        {plan.price !== 0 && (
                        <span className="text-gray-500 text-sm font-medium pt-2">/month</span>
                        )}
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-300 gap-3 group">
                        <div className="mt-1 w-4 h-4 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                            <FiCheck className="w-2.5 h-2.5 text-green-500" />
                        </div>
                        <span className="leading-tight">{feature}</span>
                        </div>
                    ))}
                    </div>

                    {/* Action Button */}
                    <button
                    onClick={() => {
                        if (!buttonState.disabled) {
                            onSelectPlan(plan.name);
                        }
                    }}
                    disabled={buttonState.disabled}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${buttonState.style}`}
                    >
                    {!buttonState.disabled && buttonState.text === "Upgrade" && <FaRocket className="w-3.5 h-3.5" />}
                    {buttonState.text === "Downgrade" && <FaRocket className="w-3.5 h-3.5 rotate-180" />}
                    {buttonState.text}
                    </button>
                </div>
                );
            })}
            </div>
            </>
        )}
      </div>
    </div>
  );
};

export default PlanSelectionModal;
