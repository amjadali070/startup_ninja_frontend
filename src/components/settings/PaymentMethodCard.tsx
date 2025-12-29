import { type FC, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiX, FiCreditCard, FiTrash2, FiCheck } from 'react-icons/fi';
import { subscriptionService } from '../../services/subscription';
import { StripeWrapper } from '../payment/StripeWrapper';
import { 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement 
} from '@stripe/react-stripe-js';

export type PaymentMethod = {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
};

interface PaymentMethodCardProps {
  onRefresh?: () => void;
}

const PaymentMethodCard: FC<PaymentMethodCardProps> = ({ onRefresh }) => {
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getUserCards();
      if (response.success && response.cards) {
        setCards(response.cards);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      const response = await subscriptionService.setDefaultCard(cardId);
      if (response.success) {
        toast.success('Default card updated');
        fetchCards();
        onRefresh?.();
      } else {
        toast.error(response.message || 'Failed to update default card');
      }
    } catch (error) {
      toast.error('Failed to update default card');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await subscriptionService.deleteCard(cardId);
      if (response.success) {
        toast.success('Card deleted successfully');
        fetchCards();
        onRefresh?.();
      } else {
        toast.error(response.message || 'Failed to delete card');
      }
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  const getCardIcon = (brand: string) => {
    const brandLower = brand?.toLowerCase() || '';
    if (brandLower.includes('visa')) return '💳';
    if (brandLower.includes('mastercard')) return '💳';
    if (brandLower.includes('amex') || brandLower.includes('american')) return '💳';
    return '💳';
  };

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
        {/* Header Section */}
        <div className="mb-4 xs:mb-5 sm:mb-6">
          <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta">Payment Methods</h3>
          <p className="text-gray-400 text-xs xs:text-sm mt-1">Manage your saved cards</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 text-sm mt-2">Loading cards...</p>
          </div>
        ) : cards.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8">
            <FiCreditCard className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-400 text-sm mb-4">No payment methods added</p>
          </div>
        ) : (
          /* Cards List */
          <div className="space-y-3 mb-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`rounded-lg border p-3 xs:p-4 transition-all ${
                  card.isDefault
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-white/10 bg-[#1A1A1A] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Card Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-8 xs:w-14 xs:h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center text-xl">
                      {getCardIcon(card.brand)}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">
                        {card.brand} •••• {card.last4}
                      </span>
                      {card.isDefault && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-xs rounded border border-red-500/30">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {card.cardholderName}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Expires {card.expiryMonth}/{card.expiryYear}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
                        title="Set as default"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                      title="Delete card"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Payment Method Button */}
        <button
          onClick={() => setShowAddCardModal(true)}
          className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 xs:px-4 py-2.5 xs:py-3 text-white text-xs xs:text-sm font-medium hover:bg-white/5 transition-colors"
        >
          + Add Payment Method
        </button>
      </section>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <StripeWrapper>
            <AddCardModalContent
                onClose={() => setShowAddCardModal(false)}
                onSuccess={() => {
                    fetchCards();
                    onRefresh?.();
                }}
            />
        </StripeWrapper>
      )}
    </>
  );
};

// Internal component to use Stripe hooks
interface AddCardModalContentProps {
    onClose: () => void;
    onSuccess: () => void;
}

const AddCardModalContent: FC<AddCardModalContentProps> = ({ onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardNumberElement); // Retrieve based on number
      if (!cardElement) return;

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: cardholderName,
        }
      });

      if (error) {
         toast.error(error.message || 'Payment processing failed');
         setLoading(false);
         return;
      }

      // Send to backend
      const response = await subscriptionService.addPaymentMethod({
        paymentMethodId: paymentMethod.id,
        cardholderName
      });

      if (response.success) {
        toast.success('Card added successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to add card');
      }
    } catch (error) {
      toast.error('Failed to add card');
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
              '::placeholder': {
                  color: '#6b7280',
              },
          },
          invalid: {
              color: '#ef4444',
          },
      },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Payment Method</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !stripe}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Card...' : 'Add Card'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
