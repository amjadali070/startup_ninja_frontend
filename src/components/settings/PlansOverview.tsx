import { type FC } from 'react';
import { FaCheck } from 'react-icons/fa';

export type Plan = {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    description: "Essential tools for hobbyists.",
    features: [
      "15 AI Chat messages/mo", 
      "5 Image Generations/mo", 
      "1 Hosted Website", 
      "10 Social Posts/mo", 
      "Community Support", 
    ],
  },
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

interface PlansOverviewProps {
    currentPlan: string;
    onSelectPlan: (planName: string) => void;
}

const PlansOverview: FC<PlansOverviewProps> = ({ currentPlan, onSelectPlan }) => {

    const getButtonState = (plan: Plan) => {
        const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
        
        // Simple price parsing to determine hierarchy 
        // Logic: Free < Startup < Pro < Enterprise
        const order = ['free', 'startup', 'pro', 'enterprise'];
        const currentIndex = order.indexOf(currentPlan.toLowerCase());
        const planIndex = order.indexOf(plan.name.toLowerCase());
        
        if (isCurrent) {
            return { text: "Current Plan", disabled: true, style: "bg-white/5 text-gray-400 cursor-default border border-white/5" };
        }
        
        if (planIndex > currentIndex) {
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
          
          return (
            <div 
                key={plan.name} 
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
                            <span className="text-xl font-bold text-white">{plan.price}</span>
                            {plan.price !== '$0' && <span className="text-gray-500 text-xs">/{plan.interval}</span>}
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
