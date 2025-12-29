import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiCreditCard, FiLock } from 'react-icons/fi';
import { subscriptionService } from '../../services/subscription';

interface PaymentStepProps {
  planName: string;
  billingCycle: string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ planName, billingCycle }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const cardRes = await subscriptionService.addPaymentMethod({
            cardNumber: cardNumber.replace(/\s/g, ''), 
            expiryDate: expiry, 
            cvc, 
            cardholderName: cardName
        });
        
        if (!cardRes.success) throw new Error(cardRes.message);
        
        const paymentMethodId = cardRes.paymentMethodId;
        
        // Purchase the subscription
        const subRes = await subscriptionService.purchaseSubscription({
            plan: planName,
            billingCycle,
            paymentMethodId
        });
        
        if (subRes.success) {
            toast.success(`Successfully subscribed to ${planName}!`);
            navigate('/dashboard');
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
                 <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                 <input 
                   type="text" 
                   placeholder="1234 5678 9012 3456" 
                   value={cardNumber} 
                   onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                   maxLength={19}
                   className={inputClass + " pl-12"} 
                   required 
                 />
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                     <input 
                       type="text" 
                       placeholder="MM/YY" 
                       value={expiry} 
                       onChange={e => setExpiry(formatExpiry(e.target.value))}
                       maxLength={5}
                       className={inputClass} 
                       required 
                     />
                 </div>

                 <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                     <input 
                       type="text" 
                       placeholder="123" 
                       value={cvc} 
                       onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0,3))}
                       maxLength={3}
                       className={inputClass} 
                       required 
                     />
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
               disabled={loading} 
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

             <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
               <FiLock className="text-green-500" />
               <span>Secured by 256-bit SSL encryption</span>
             </div>
        </form>
    </div>
  );
};

export default PaymentStep;
