import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';
import { FaStripe, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { subscriptionService } from '../../services/subscription';
import { StripeWrapper } from '../payment/StripeWrapper';
import { 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement 
} from '@stripe/react-stripe-js';

interface PaymentStepProps {
  planName: string;
  billingCycle: string;
}

const PaymentStepContent: React.FC<PaymentStepProps> = ({ planName, billingCycle }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) throw new Error("Card element not found");

        const { error, paymentMethod } = await stripe.createPaymentMethod({
             type: 'card',
             card: cardElement,
             billing_details: { name: cardName }
        });

        if (error) throw new Error(error.message);

        // 1. Add Payment Method to Backend (Saves it to DB)
        const cardRes = await subscriptionService.addPaymentMethod({
            paymentMethodId: paymentMethod.id,
            cardholderName: cardName
        });
        
        if (!cardRes.success) throw new Error(cardRes.message);
        const dbPaymentMethodId = cardRes.paymentMethodId;
        
        // 2. Purchase Subscription using the saved card
        const subRes = await subscriptionService.purchaseSubscription({
            plan: planName,
            billingCycle,
            paymentMethodId: dbPaymentMethodId
        });
        
        if (subRes.success) {
            toast.success(`Successfully subscribed to ${planName}!`);
            navigate('/dashboard');
        } else if (subRes.requiresStudentVerification) {
            // Shouldn't normally be reachable — BuySubscription gates this
            // plan behind an approved-verification check before this step
            // even renders — but kept as a real safety net in case
            // verification expired in the gap between that check and this
            // submit, rather than leaving the user with a bare failure.
            toast.error(subRes.message || 'Student verification is required for this plan.');
            navigate('/settings');
        } else {
            throw new Error(subRes.message);
        }
    } catch (err: any) {
        toast.error(err.message || 'Payment failed');
    } finally {
        setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200";
  const elementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#ffffff',
            '::placeholder': { color: '#6b7280' },
        },
        invalid: { color: '#ef4444' },
    },
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payment details</h1>
          <p className="text-gray-400">Enter your card information to complete purchase</p>
        </div>
        
        <form onSubmit={handlePayment} className="space-y-5 max-w-md mx-auto">
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
               <div className="relative">
                 <div className={inputClass + " flex items-center"}>
                    <CardNumberElement options={elementOptions} className="w-full" />
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                     <div className={inputClass}>
                        <CardExpiryElement options={elementOptions} />
                     </div>
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                     <div className={inputClass}>
                        <CardCvcElement options={elementOptions} />
                     </div>
                 </div>
             </div>
             
             <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Cardholder Name</label>
                 <input 
                   type="text" 
                   placeholder="John Doe" 
                   value={cardName} 
                   onChange={e => setCardName(e.target.value)}
                   className={inputClass} 
                   required 
                 />
             </div>
             
             <button 
               type="submit" 
               disabled={loading || !stripe} 
               className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-600/20 hover:shadow-green-600/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {loading ? (
                 <>
                   <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <span>Processing...</span>
                 </>
               ) : (
                 <>
                   <FiLock />
                   <span>Complete Purchase</span>
                 </>
               )}
             </button>

             <div className="flex flex-col items-center gap-3 mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                   <FiLock className="text-green-500" />
                   <span>Secured by 256-bit SSL encryption</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                    <FaCcVisa size={24} />
                    <FaCcMastercard size={24} />
                    <FaCcAmex size={24} />
                    <FaCcDiscover size={24} />
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <span>Powered by</span>
                    <FaStripe size={38} className="text-[#6772E5] mt-0.5" />
                </div>
             </div>
        </form>
    </div>
  );
};

const PaymentStep: React.FC<PaymentStepProps> = (props) => {
    return (
        <StripeWrapper>
            <PaymentStepContent {...props} />
        </StripeWrapper>
    );
};

export default PaymentStep;
