import React, { useState, useRef, useEffect } from 'react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  email: string;
  loading: boolean;
  isLoginVerification?: boolean;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onVerify,
  onResendCode,
  email,
  loading,
  isLoginVerification = false
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    // Clear error when user starts typing
    if (error) setError('');
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      try {
        setError('');
        await onVerify(otpString);
      } catch (err: any) {
        setError(err.message || 'Verification failed. Please try again.');
      }
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setError(''); // Clear any existing errors
    try {
      await onResendCode();
      // Clear OTP inputs when new code is sent
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] rounded-3xl p-8 w-full max-w-md mx-auto shadow-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <img 
            src="/public/images/logo.png" 
            alt="Startup Ninja Logo" 
            className="h-16 mx-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-bold text-center mt-6 mb-2">
          Verify your email address
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm text-center mt-2 mb-8">
          Enter The 6 Digit code sent to your {email}
        </p>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 bg-[#1A1A1A] border border-gray-700 rounded-xl text-white text-center text-2xl font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                disabled={loading}
              />
            ))}
          </div>

          {/* Resend Code */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading || loading}
              className="text-red-500 font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isOtpComplete || loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl mt-8 transition-colors duration-200"
          >
            {loading ? 'VERIFYING...' : 'VERIFY'}
          </button>
        </form>


      </div>
    </div>
  );
};

export default EmailVerificationModal;