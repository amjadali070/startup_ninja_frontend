import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { LoginRequest, AuthResponse } from '../types/auth';
import { FaApple } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import SocialAuth from '../components/SocialAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!showPasswordStep) {
      const trimmedEmail = formData.email.trim();
      if (!trimmedEmail) {
        setError('Please enter your email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setError('Please enter a valid email address.');
        return;
      }

      setShowPasswordStep(true);
      setShowPassword(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);
      if (response.success && response.token) {
        setError('');
        login(response.user, response.token); // update context
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuthSuccess = (response: AuthResponse) => {
    setError('');
    if (response.token && response.user) {
      login(response.user, response.token);
      navigate('/dashboard');
    }
  };

  const handleSocialAuthError = (message: string) => {
    setError(message);
  };

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      <div className="w-full lg:w-[420px] xl:w-[440px] 2xl:w-[460px] bg-black px-4 sm:mx-0 md:mx-0 lg:mx-24 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-center relative z-10 min-h-screen pt-6 sm:pt-8 lg:pt-12">
          <img
            src="/images/logo.png"
            alt="Startup Ninja"
            className="h-16 sm:h-18 lg:h-20 w-auto mx-auto"
          />

        <div className="w-full max-w-full mx-auto lg:mx-0 pt-12 sm:pt-16 lg:pt-6">
          <h1 className="text-white text-[13px] sm:text-[14px] font-normal mb-4 sm:mb-6 leading-relaxed font-plus-jakarta">
            Sign up or Login with
          </h1>

          <div className="space-y-2.5 mb-4 sm:mb-6">
            <button className="w-full h-[38px] sm:h-[42px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[11px] sm:text-[12px] font-medium flex items-center px-3 transition-colors duration-200">
              <FaApple className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-2.5" />
              Apple
            </button>

            <SocialAuth
              buttonText="continue_with"
              onAuthSuccess={handleSocialAuthSuccess}
              onAuthError={handleSocialAuthError}
              showDivider={false}
            />

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full h-[38px] sm:h-[42px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[11px] sm:text-[12px] font-medium flex items-center px-3 transition-colors duration-200"
            >
              <HiOutlineMail className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-2.5" />
              Continue with Email
            </button>
          </div>

          <div className="flex items-center mb-4 sm:mb-6">
            <div className="flex-1 h-px bg-[#333333]"></div>
            <span className="px-2.5 sm:px-3 text-[#888888] text-[10px] sm:text-[11px] font-medium tracking-wider">OR</span>
            <div className="flex-1 h-px bg-[#333333]"></div>
          </div>

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@host.com"
                className="w-full h-[38px] sm:h-[42px] bg-[#333333] border border-[#404040] rounded-[8px] px-3 text-white text-[11px] sm:text-[12px] placeholder-[#888888] focus:outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000] transition-colors duration-200"
                autoComplete="email"
                required
              />
            </div>

            {showPasswordStep && (
              <div>
                <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-[38px] sm:h-[42px] bg-[#333333] border border-[#404040] rounded-[8px] px-3 pr-10 text-white text-[11px] sm:text-[12px] placeholder-[#888888] focus:outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000] transition-colors duration-200"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#888888] hover:text-white transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-2.5 bg-red-900/20 border border-red-500 rounded-[8px] text-red-400 text-[11px] sm:text-[12px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[38px] sm:h-[42px] 
                [background:linear-gradient(90deg,#DC2626_0%,#B91C1C_100%)] 
                hover:[background:linear-gradient(90deg,#B91C1C_0%,#7F1D1D_100%)] 
                disabled:opacity-50 
                rounded-[8px] text-white text-[11px] sm:text-[12px] 
                font-semibold tracking-wide transition-colors duration-200" >            
              {loading
                ? showPasswordStep
                  ? 'LOGGING IN...'
                  : 'CONTINUING...'
                : showPasswordStep
                  ? 'LOG IN'
                  : 'CONTINUE'}
            </button>
          </form>

          <div className="text-center mt-4 pb-6 sm:pb-0 flex flex-col items-center gap-1.5">
            
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[#9CA3AF] text-[11px] sm:text-[12px] leading-tight">
                New here?
              </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[11px] sm:text-[12px] font-semibold leading-tight bg-gradient-to-r from-[#DC2626] via-[#E50000] to-[#B91C1C] text-transparent bg-clip-text hover:from-[#FF5A5A] hover:via-[#FF1A1A] hover:to-[#B80000] transition-colors duration-200"
              >
                Create a Startup Ninja account
              </button>
            </div>
            
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img 
          src="/images/login-bg.png" 
          alt="Samurai silhouette" 
          className="absolute inset-0 w-[100%] h-full object-cover object-center"
        />
        
        <div className="absolute inset-0 bg-gradient-login"></div>

        {/* Top blend gradient to create visual padding with black mix */}
        {/* <div className="absolute top-0 left-0 right-0 h-40 sm:h-48 lg:h-56 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none"></div> */}

        {/* <div className="absolute bottom-6 sm:bottom-8 lg:bottom-16 right-6 sm:right-8 lg:right-24 max-w-[500px] xl:max-w-[650px] z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-[12px] lg:rounded-[16px] p-4 lg:p-6 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <p className="text-white/90 text-[12px] lg:text-[13px] leading-[1.5] lg:leading-[1.6] font-normal antialiased justify">
              A sleek red sports bike parked in a narrow urban alley, realistic 3D render style. 
              The bike should shine with polished metal and vivid red paint, detailed tires, 
              and reflections of soft street lights on its surface. The alley should have textured brick walls, 
              scattered light reflections on the ground, and a slightly cinematic mood. White background 
              not needed—keep it natural, immersive, and dramatic, like a professional automotive 
              photoshoot in a city alley.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
