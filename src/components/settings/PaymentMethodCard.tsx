import { type FC } from 'react';

export type PaymentMethod = {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  bankName: string;
  cardholderName: string;
  isDefault: boolean;
};

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onEdit: (paymentMethod: PaymentMethod) => void;
  onAddPaymentMethod: () => void;
}

const PaymentMethodCard: FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onEdit,
  onAddPaymentMethod,
}) => {
  const maskCardNumber = (cardNumber: string) => {
    const lastFour = cardNumber.slice(-4);
    const masked = '•'.repeat(cardNumber.length - 4);
    return `${masked}${lastFour}`;
  };

  const formatExpiryDate = (expiryDate: string) => {
    // Assuming expiryDate is in MM/YY format
    return `Expires ${expiryDate}`;
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      {/* Header Section */}
      <div className="mb-4 xs:mb-5 sm:mb-6">
        <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta">Payment Method</h3>
      </div>

      {/* Existing Payment Method Card */}
      <div className="mb-3 xs:mb-4">
        <div className="rounded-lg border border-white/10 bg-[#1A1A1A] p-3 xs:p-4 flex items-center gap-4 xs:gap-6">
          {/* Credit Card Visual */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-8 xs:w-16 xs:h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md shadow-sm overflow-hidden">
              {/* Card Pattern Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                
                {/* Mastercard Logo */}
                <div className="absolute bottom-0.5 xs:bottom-1 right-0.5 xs:right-1">
                  <div className="flex">
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-red-500 rounded-full"></div>
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                
                {/* Contactless Symbol */}
                <div className="absolute top-1 xs:top-2 right-1 xs:right-2">
                  <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 border border-gray-400 rounded-full flex items-center justify-center">
                    <div className="w-0.5 h-0.5 xs:w-1 xs:h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs xs:text-sm font-medium mb-1 truncate">
              {maskCardNumber(paymentMethod.cardNumber)}
            </div>
            <div className="text-gray-400 text-xs xs:text-sm truncate">
              {formatExpiryDate(paymentMethod.expiryDate)}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(paymentMethod)}
            className="text-[#DE0500] hover:text-[#FF1A1A] transition-colors text-xs xs:text-sm font-medium flex-shrink-0"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Add Payment Method Button */}
      <button
        onClick={onAddPaymentMethod}
        className="w-full rounded-lg border border-white/10 bg-[#1A1A1A] px-3 xs:px-4 py-2.5 xs:py-3 text-white text-xs xs:text-sm font-medium hover:bg-white/5 transition-colors"
      >
        Add Payment Method
      </button>
    </section>
  );
};

export default PaymentMethodCard;
