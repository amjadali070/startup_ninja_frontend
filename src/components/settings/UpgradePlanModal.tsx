import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiX, FiCreditCard, FiLock, FiArrowLeft } from 'react-icons/fi';
import { subscriptionService } from '../../services/subscription';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  planName: string;
  billingCycle?: string;
  onSuccess: () => void;
}

const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
  isOpen,
  onClose,
  onBack,
  planName,
  billingCycle = 'monthly',
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [useNewCard, setUseNewCard] = useState(false);
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCards();
    }
  }, [isOpen]);

  const fetchCards = async () => {
    try {
      const response = await subscriptionService.getUserCards();
      if (response.success && response.cards) {
        setCards(response.cards);
        // Auto-select default card if available
        const defaultCard = response.cards.find((card: SavedCard) => card.isDefault);
        if (defaultCard) {
          setSelectedCardId(defaultCard.id);
          setUseNewCard(false);
        } else if (response.cards.length > 0) {
          setSelectedCardId(response.cards[0].id);
          setUseNewCard(false);
        } else {
          setUseNewCard(true);
        }
      } else {
        setUseNewCard(true);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      setUseNewCard(true);
    }
  };

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

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let paymentMethodId;
      
      // If user wants to use a new card, add it first
      if (useNewCard) {
        const cardRes = await subscriptionService.addPaymentMethod({
          cardNumber: cardNumber.replace(/\s/g, ''), 
          expiryDate: expiry, 
          cvc, 
          cardholderName: cardName
        });
        
        if (!cardRes.success) throw new Error(cardRes.message);
        paymentMethodId = cardRes.paymentMethodId;
      } else {
        // Use selected existing card
        paymentMethodId = selectedCardId;
      }
      
      // Purchase the subscription
      const subRes = await subscriptionService.purchaseSubscription({
        plan: planName,
        billingCycle,
        paymentMethodId
      });
      
      if (subRes.success) {
        toast.success(`Successfully upgraded to ${planName}!`);
        onSuccess();
        onClose();
      } else {
        throw new Error(subRes.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
                title="Back to plan selection"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">Upgrade to {planName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Payment Method</label>
          <div className="space-y-3">
            {/* Saved Cards */}
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setSelectedCardId(card.id);
                  setUseNewCard(false);
                }}
                className={`w-full p-4 rounded-xl border transition-all ${
                  !useNewCard && selectedCardId === card.id
                    ? 'border-red-500 bg-red-500/10' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiCreditCard className="text-xl" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {card.brand} ending in {card.last4}
                        {card.isDefault && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded border border-green-500/30">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{card.cardholderName}</div>
                      <div className="text-xs text-gray-500">Expires {card.expiryMonth}/{card.expiryYear}</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !useNewCard && selectedCardId === card.id ? 'border-red-500' : 'border-white/20'
                  }`}>
                    {!useNewCard && selectedCardId === card.id && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                  </div>
                </div>
              </button>
            ))}

            {/* Add New Card Option */}
            <button
              type="button"
              onClick={() => setUseNewCard(true)}
              className={`w-full p-4 rounded-xl border transition-all ${
                useNewCard 
                  ? 'border-red-500 bg-red-500/10' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiCreditCard className="text-xl" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">Add new card</div>
                    <div className="text-xs text-gray-400">Enter new card details</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  useNewCard ? 'border-red-500' : 'border-white/20'
                }`}>
                  {useNewCard && <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* New Card Form */}
        {useNewCard && (
          <form onSubmit={handleUpgrade} className="space-y-5">
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
                  <span>Confirm Upgrade</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
              <FiLock className="text-green-500" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </form>
        )}

        {/* Existing Card Confirmation */}
        {!useNewCard && (
          <button 
            onClick={handleUpgrade}
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
                <span>Confirm Upgrade</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default UpgradePlanModal;
