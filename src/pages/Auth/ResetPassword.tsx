import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth';
import { FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ResetPasswordForm>();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/login');
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await authService.resetPassword(token, data.password);
      
      if (response.success) {
        toast.success(response.message || 'Password reset successful');
        navigate('/login', { replace: true });
      } else {
        toast.error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password');

  if (!token) return null;

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
            Set New Password
          </h2>
          <p className="text-sm text-gray-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`block w-full rounded-lg border bg-[#1A1A1A] pl-10 pr-10 p-2.5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <FaEye className="h-4 w-4" />
                  ) : (
                    <FaEyeSlash className="h-4 w-4" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`block w-full rounded-lg border bg-[#1A1A1A] pl-10 pr-10 p-2.5 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500 sm:text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => {
                      if (watch('password') != val) {
                        return "Your passwords do not match";
                      }
                    },
                  })}
                />
                <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                 >
                   {showConfirmPassword ? (
                     <FaEye className="h-4 w-4" />
                   ) : (
                     <FaEyeSlash className="h-4 w-4" />
                   )}
                 </button>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
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
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
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
    </div>
  );
};

export default ResetPassword;
