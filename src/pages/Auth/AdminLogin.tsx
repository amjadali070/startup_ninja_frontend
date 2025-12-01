import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const formData = { email, password };
      const response = await authService.login(formData);

      if (response.success && response?.token) {
        if (response?.user?.role !== 'admin') {
          setError('Access denied. This portal is for administrators only.');
          setLoading(false);
          return;
        }

        setError('');
        login(response.user, response.token);
        navigate('/admin-dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  const handleCreateAccount = () => {
    console.log('Create account clicked');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Ninja Silhouette Background */}
      <div className="absolute right-0 bottom-0 opacity-100 pointer-events-none">
          <img
            src="/images/adminLogin-bg.png"
            alt="Ninja Silhouette"
            className="h-screen object-cover"
            onError={(e) => {
              // Fallback: Hide the image if it doesn't exist
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
      </div>

      {/* Login Card */}
      <div className="bg-[#00000073] rounded-xl border border-[#242424] p-8 max-w-md w-full mx-4 relative z-10 backdrop-blur-[24px]" style={{ boxShadow: '0px 10px 30px 0px #00000073' }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Startup Ninja Logo"
              className="h-16 mx-auto"
            />
          </Link>
        </div>

        {/* Welcome Text */}
        <h1 className="text-white text-xl text-center mb-8">
          Sign in to manage Startup Ninja
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 text-sm" />
            </div>
            <input
              type="email"
              placeholder="Admin Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg text-white pl-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 text-sm" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-700 rounded-lg text-white pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? <FaEye className="text-sm" /> : <FaEyeSlash className="text-sm" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-2.5 bg-red-900/20 border border-red-500 rounded-[8px] text-red-400 text-[11px] sm:text-[12px]">
              {error}
            </div>
          )}

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded bg-[#2A2A2A]"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-red-500 hover:underline focus:outline-none"
            >
              Forgotten Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-3 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] mt-6 border border-[#FFFFFF40]"
            style={{
              background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)',
              boxShadow: '0px 12px 25px 0px #7F1D1D80'
            }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center mt-4">
          <span className="text-gray-400 text-sm">
            Need admin access?{' '}
            <button
              onClick={handleCreateAccount}
              className="text-red-500 hover:underline focus:outline-none"
            >
              Contact Support
            </button>
          </span>
        </div>

        {/* Back to User Login */}
        <div className="text-center mt-4 pt-4 border-t border-gray-700">
          <Link
            to="/login"
            className="text-gray-400 text-sm hover:text-gray-300 focus:outline-none"
          >
            ← Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;