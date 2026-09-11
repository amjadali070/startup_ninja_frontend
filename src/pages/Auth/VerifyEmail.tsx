import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get('userId');
  const otp = searchParams.get('otp');

  // Manual input state
  const [manualUserId, setManualUserId] = useState('');
  const [manualOtp, setManualOtp] = useState('');

  useEffect(() => {
    if (userId && otp) {
      verifyToken(userId, otp);
    } else {
      setLoading(false);
      // Stay in idle to show form
    }
  }, [userId, otp]);

  const verifyToken = async (uid: string, token: string) => {
    try {
      setVerifying(true);
      const response = await authService.verifyEmail(uid, token);
      
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        // Redirect after a few seconds
        setTimeout(() => {
           navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.message || 'Verification failed. The link may be invalid or expired.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred during verification.');
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUserId || !manualOtp) {
      toast.error("Please enter both User ID and OTP");
      return;
    }
    verifyToken(manualUserId, manualOtp);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D] p-4 text-white font-plus-jakarta">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl text-center">
        {/* Header */}
        <div>
          <Link to="/" className="inline-block mb-6">
             <img
              src="/images/logo.png"
              alt="Startup Ninja"
              className="h-16 w-auto mx-auto"
            />
          </Link>
        </div>

        {loading || verifying ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner />
            <p className="text-gray-400 mt-2">Please wait while we validate your code.</p>
          </div>
        ) : status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <FiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Verified!</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="text-sm text-gray-500">Redirecting to dashboard...</div>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center text-sm font-medium text-red-500 hover:text-red-400"
            >
              Go to Dashboard <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : status === 'error' ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <FiXCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Verification Failed</h3>
            <p className="text-gray-300 mb-6">{message}</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStatus('idle')}
                className="rounded-lg bg-[#222] px-4 py-2 text-sm font-medium text-white hover:bg-[#333] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          // Manual Entry Form
          <div className="text-left">
            <h3 className="text-xl font-bold text-white mb-2 text-center">Verify Your Email</h3>
            <p className="text-gray-400 mb-6 text-center text-sm">
              Enter the User ID and OTP sent to your email address.
            </p>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                <input
                  type="text"
                  value={manualUserId}
                  onChange={(e) => setManualUserId(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-[#1A1A1A] p-2.5 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="Paste User ID here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">OTP Code</label>
                <input
                  type="text"
                  value={manualOtp}
                  onChange={(e) => setManualOtp(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-[#1A1A1A] p-2.5 text-white focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Verify
              </button>
            </form>
             <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
