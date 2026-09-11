import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import OrderSummary from '../../components/subscription/OrderSummary';
import StepIndicator from '../../components/subscription/StepIndicator';
import RegistrationStep from '../../components/subscription/RegistrationStep';
import PaymentStep from '../../components/subscription/PaymentStep';
import StudentVerificationModal from '../../components/settings/StudentVerificationModal';
import { planService, Plan } from '../../services/plan';
import { studentVerificationService } from '../../services/studentVerification';
import LoadingSpinner from '../../components/LoadingSpinner';

const BuySubscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const planName = searchParams.get('plan') || 'Go';
  const billingCycle = searchParams.get('billing') || 'monthly';

  const [step, setStep] = useState(isAuthenticated ? 2 : 1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Go Student requires an approved verification before payment is ever
  // shown — checked here, not discovered as a 403 after the user has
  // already entered card details. 'checking' blocks rendering PaymentStep
  // until we know for sure, so an unverified visitor never briefly sees
  // (or can submit) a payment form for a plan they can't actually buy yet.
  const isGoStudentPlan = selectedPlan?.key === 'go_student';
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

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

  const checkVerification = useCallback(async () => {
    const res = await studentVerificationService.getMyStatus();
    const approved = res.success && res.data?.status === 'approved';
    setIsVerified(approved);
    setVerificationChecked(true);
    setShowVerificationModal(!approved);
  }, []);

  useEffect(() => {
    if (step === 2 && isGoStudentPlan && isAuthenticated) {
      setVerificationChecked(false);
      checkVerification();
    }
  }, [step, isGoStudentPlan, isAuthenticated, checkVerification]);

  const readyForPayment = !isGoStudentPlan || (verificationChecked && isVerified);
  const waitingOnVerification = step === 2 && isGoStudentPlan && !readyForPayment;

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
              {step === 2 && waitingOnVerification && (
                <div className="w-full bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-8 border border-white/10 text-center">
                  {!verificationChecked ? (
                    <div className="py-10 flex justify-center"><LoadingSpinner /></div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white mb-2">Student verification required</h2>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        The Go Student price needs an approved student ID before checkout. Submit your details below —
                        most reviews finish within 1-2 business days.
                      </p>
                    </>
                  )}
                </div>
              )}
              {step === 2 && readyForPayment && <PaymentStep planName={planName} billingCycle={billingCycle} />}
            </div>
          </div>
        </div>
      </div>

      {isGoStudentPlan && (
        <StudentVerificationModal
          isOpen={showVerificationModal}
          onClose={() => {
            setShowVerificationModal(false);
            if (!isVerified) {
              toast('You can finish verification anytime from Settings — we will email you once it is reviewed.', { icon: 'ℹ️' });
              navigate('/pricing');
            }
          }}
          onVerified={() => {
            setIsVerified(true);
            setShowVerificationModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BuySubscription;
