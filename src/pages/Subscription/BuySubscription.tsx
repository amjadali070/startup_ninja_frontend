import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import OrderSummary from '../../components/subscription/OrderSummary';
import StepIndicator from '../../components/subscription/StepIndicator';
import RegistrationStep from '../../components/subscription/RegistrationStep';
import PaymentStep from '../../components/subscription/PaymentStep';

const BuySubscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const planName = searchParams.get('plan') || 'Pro';
  const billingCycle = searchParams.get('billing') || 'monthly';
  
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  
  useEffect(() => {
    if (isAuthenticated) setStep(2);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 lg:p-8">
      {/* Centered Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side - Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <OrderSummary planName={planName} billingCycle={billingCycle} />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-xl mx-auto">
            <StepIndicator currentStep={step} />
            
            <div className="mt-8">
              {step === 1 && <RegistrationStep onSuccess={() => setStep(2)} />}
              {step === 2 && <PaymentStep planName={planName} billingCycle={billingCycle} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySubscription;
