import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import { FaRocket } from 'react-icons/fa';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (planName: string) => void;
}

interface Plan {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Startup",
    price: "$9",
    interval: "month",
    description: "Perfect for early-stage startups.",
    features: [
      "50 AI Chat messages/mo",
      "20 Image Generations/mo",
      "3 Website projects",
      "Basic Social scheduling",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    interval: "month",
    isPopular: true,
    description: "Power tools for growth.",
    features: [
      "500 AI Chat messages/mo",
      "100 Image Generations/mo",
      "10 Website projects",
      "Full Social Media Pro",
      "Priority Support",
      "Custom Domain",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    interval: "month",
    description: "For scaling teams and agencies.",
    features: [
      "Unlimited AI Chat",
      "1000 Image Generations/mo",
      "50 Website projects",
      "Team Management",
      "Dedicated Support",
      "White-label Options",
    ],
  },
];

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const getButtonState = (plan: Plan) => {
    const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
    
    const order = ['free', 'startup', 'pro', 'enterprise'];
    const currentIndex = order.indexOf(currentPlan.toLowerCase());
    const planIndex = order.indexOf(plan.name.toLowerCase());
    
    if (isCurrent) {
      return { 
        text: "Current Plan", 
        disabled: true, 
        style: "bg-white/5 text-gray-400 cursor-default border border-white/5" 
      };
    }
    
    if (planIndex > currentIndex) {
      return { 
        text: "Upgrade", 
        disabled: false, 
        style: plan.isPopular 
          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20" 
          : "bg-white text-black hover:bg-gray-200"
      };
    } else {
      return { 
        text: "Downgrade", 
        disabled: false, 
        style: "bg-[#151515] border border-white/10 hover:bg-[#202020] text-gray-300" 
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-gray-400 text-sm mt-1">Select a plan that fits your needs</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Plans Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const buttonState = getButtonState(plan);
            const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 transition-all ${
                  plan.isPopular
                    ? 'border-red-500/50 bg-red-500/5'
                    : isCurrent
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white uppercase tracking-wider">
                      Recommended
                    </span>
                  </div>
                )}

                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white uppercase tracking-wider flex items-center gap-1">
                      <FiCheck size={12} />
                      Current
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.price !== '$0' && (
                      <span className="text-gray-500 text-sm">/{plan.interval}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-5">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-300">
                      <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
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
                  className={`w-full px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${buttonState.style}`}
                >
                  {!isCurrent && <FaRocket className="w-4 h-4" />}
                  {buttonState.text}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;
