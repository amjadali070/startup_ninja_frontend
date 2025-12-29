import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center">
      {/* Step 1 */}
      <div className="flex items-center">
        <div className="flex flex-col items-center relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
            currentStep === 1 
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
              : currentStep > 1
              ? 'bg-green-600 text-white'
              : 'bg-white/5 text-gray-500 border border-white/10'
          }`}>
            {currentStep > 1 ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              '1'
            )}
          </div>
          <span className={`mt-2.5 text-xs font-medium transition-colors ${
            currentStep >= 1 ? 'text-white' : 'text-gray-600'
          }`}>
            Account
          </span>
        </div>
      </div>

      {/* Connector */}
      <div className="relative mx-6">
        <div className="w-20 h-[2px] bg-white/10"></div>
        <div 
          className={`absolute top-0 left-0 h-[2px] transition-all duration-500 ${
            currentStep > 1 ? 'w-full bg-green-600' : 'w-0 bg-red-600'
          }`}
        ></div>
      </div>

      {/* Step 2 */}
      <div className="flex items-center">
        <div className="flex flex-col items-center relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
            currentStep === 2 
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
              : 'bg-white/5 text-gray-500 border border-white/10'
          }`}>
            2
          </div>
          <span className={`mt-2.5 text-xs font-medium transition-colors ${
            currentStep >= 2 ? 'text-white' : 'text-gray-600'
          }`}>
            Payment
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
