import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCheck, FiArrowLeft, FiShield, FiClock, FiRefreshCw } from 'react-icons/fi';
import { Plan } from '../../services/plan';

interface OrderSummaryProps {
  planName: string;
  billingCycle: string;
  plan?: Plan | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ planName, billingCycle, plan }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.from === 'pricing') {
       navigate('/#pricing');
       setTimeout(() => {
         const element = document.getElementById('pricing');
         if (element) element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    } else {
       navigate(-1);
    }
  };

  const getPriceDetails = () => {
    if (plan) {
        const monthlyPrice = plan.price;
        const annualMonthlyPrice = plan.discountPrice || plan.price; // Cost per month when billed annually

        // Layout shows "Billed yearly" -> "Amount".
        // Original code: "startup: { monthly: 9, annual: 90 }"
        // If billing='annual', amount=90.
        // My plan data annualMonthlyPrice = 19.99 (Example). Total = 239.88.
        
        // Let's stick to "Amount to charge now".
        // If monthly, charge monthlyPrice.
        // If annual, charge annualMonthlyPrice * 12.
        
        const chargeAmount = billingCycle === 'annual' ? (annualMonthlyPrice * 12) : monthlyPrice;
        
        const savings = billingCycle === 'annual' ? ((monthlyPrice * 12) - chargeAmount) : 0;
        
        return { amount: parseFloat(chargeAmount.toFixed(2)), savings: parseFloat(savings.toFixed(2)) };
    }

    // Fallback (used only if live plan data hasn't loaded)
    const prices: Record<string, { monthly: number; annual: number }> = {
      go: { monthly: 15, annual: 144 },
      go_student: { monthly: 10, annual: 96 },
      pro: { monthly: 39, annual: 372 },
      business: { monthly: 99, annual: 948 },
    };

    const planKey = planName.toLowerCase().replace(' plan', '').replace(' ', '_');
    const price = prices[planKey] || prices.pro;
    const amount = billingCycle === 'annual' ? price.annual : price.monthly;
    const savings = billingCycle === 'annual' ? (price.monthly * 12 - price.annual) : 0;
    
    return { amount, savings };
  };

  const { amount, savings } = getPriceDetails();

  const features = plan ? (plan.features || []) : [
    'Unlimited AI generations',
    'Priority support',
    'Advanced analytics',
    'Team collaboration',
    'Custom integrations'
  ];

  return (
    <div className="w-full bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300 mb-6 group"
      >
        <FiArrowLeft className="transition-transform group-hover:-translate-x-1" /> 
        <span>Back</span>
      </button>

      {/* Logo */}
      <Link to="/" className="block mb-8">
        <img src="/images/logo.png" alt="Logo" className="h-10 w-auto hover:scale-105 transition-transform duration-300" />
      </Link>

      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

        {/* Plan Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 mb-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-white capitalize">{planName} Plan</h3>
              <p className="text-xs text-gray-400 capitalize mt-1">Billed {billingCycle}</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">${amount}</div>
              <div className="text-xs text-gray-400">/{billingCycle === 'annual' ? 'year' : 'month'}</div>
            </div>
          </div>

          {billingCycle === 'annual' && savings > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-green-400 text-xs font-medium">You save ${savings}/year</span>
              <span className="text-xs text-green-400/70">vs monthly</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">What's Included</p>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2.5 text-sm text-gray-300">
              <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <FiCheck className="text-green-500 text-xs" />
              </div>
              <span className="text-xs">{feature}</span>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="space-y-2.5 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2.5 text-xs text-gray-400">
            <FiClock className="text-gray-500 flex-shrink-0" />
            <span>Instant access after payment</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-400">
            <FiRefreshCw className="text-gray-500 flex-shrink-0" />
            <span>Cancel anytime, no questions</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-400">
            <FiShield className="text-gray-500 flex-shrink-0" />
            <span>Secure 256-bit encryption</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <FiShield className="text-green-500" />
          <span>Powered by Stripe • PCI DSS Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
