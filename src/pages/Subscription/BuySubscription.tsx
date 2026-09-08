import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import OrderSummary from '../../components/subscription/OrderSummary';
import StepIndicator from '../../components/subscription/StepIndicator';
import RegistrationStep from '../../components/subscription/RegistrationStep';
import PaymentStep from '../../components/subscription/PaymentStep';
import { planService, Plan } from '../../services/plan';

const BuySubscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const planName = searchParams.get('plan') || 'Go';
  const billingCycle = searchParams.get('billing') || 'monthly';
  
  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const response = await planService.getAllPlans();
            if (response.success && response.data) {
                // Try to find the plan
                const found = response.data.find(p => 
                    p.name.toLowerCase() === planName.toLowerCase() || 
                    p.key === planName.toLowerCase()
                );
                if (found) setSelectedPlan(found);
            }
        } catch (error) {
            console.error("Failed to fetch plans", error);
        }
    };
    fetchPlans();
  }, [planName]);
  
  useEffect(() => {
    if (isAuthenticated) setStep(2);
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 lg:p-8">
      {/* Centered Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Side - Order Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <OrderSummary planName={planName} billingCycle={billingCycle} plan={selectedPlan} />
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
