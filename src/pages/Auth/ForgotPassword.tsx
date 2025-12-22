import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setLoading(true);
      const response = await authService.forgotPassword(data.email);
      
      if (response.success) {
        setEmailSent(true);
        toast.success(response.message || 'Password reset link sent to your email');
      } else {
        toast.error(response.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D] p-4 text-white font-plus-jakarta">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-[#141414] p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
             <img
              src="/images/logo.png"
              alt="Startup Ninja"
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-400">
            {emailSent 
              ? "Check your inbox for the reset link" 
              : "Enter your email for a reset link"}
          </p>
        </div>

        {emailSent ? (
          <div className="space-y-6">
             <div className="rounded-lg bg-green-500/10 p-4 text-green-400 text-center text-sm border border-green-500/20">
              We have sent a password reset link to your email address. Please follow the link to reset your password.
            </div>
            <div className="text-center text-sm text-gray-400">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="font-medium text-red-500 hover:text-red-400"
                >
                  Try again
                </button>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full rounded-lg border bg-[#1A1A1A] pl-10 p-2.5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                      errors.email ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="name@company.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#DC2626] to-[#991B1B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-[#B91C1C] hover:to-[#7F1D1D] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <CgSpinner className="mr-2 h-5 w-5 animate-spin" />
                  Sending link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
        
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
    </div>
  );
};

export default ForgotPassword;
