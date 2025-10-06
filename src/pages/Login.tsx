import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { LoginRequest, AuthResponse } from '../types/auth';
import { FaApple } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import SocialAuth from '../components/SocialAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
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
    if (response.token) {
      navigate('/dashboard');
    }
  };

  const handleSocialAuthError = (message: string) => {
    setError(message);
  };

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      <div className="w-full lg:w-[460px] xl:w-[480px] 2xl:w-[500px] bg-black px-6 sm:mx-0 md:mx-0 lg:mx-32 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center relative z-10 min-h-screen pt-8 sm:pt-12 lg:pt-16">
        <div className="absolute top-8 sm:top-12 lg:top-16 left-6 sm:left-8 md:left-12 lg:left-16">
          <img src="/images/logo.png" alt="Startup Ninja" className="h-16 sm:h-12 lg:h-16 w-auto" />
        </div>

        <div className="w-full max-w-full mx-auto lg:mx-0 pt-20 sm:pt-24 lg:pt-8">
          <h1 className="text-white text-[15px] sm:text-[16px] font-normal mb-6 sm:mb-8 leading-relaxed">
            Sign up or Login with
          </h1>

          <div className="space-y-3 mb-6 sm:mb-8">
            <button className="w-full h-[44px] sm:h-[48px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center px-4 transition-colors duration-200">
              <FaApple className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
              Apple
            </button>

            <SocialAuth
              buttonText="continue_with"
              onAuthSuccess={handleSocialAuthSuccess}
              onAuthError={handleSocialAuthError}
              showDivider={false}
            />

            <button className="w-full h-[44px] sm:h-[48px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center px-4 transition-colors duration-200">
              <HiOutlineMail className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
              Continue with Email
            </button>
          </div>

          <div className="flex items-center mb-6 sm:mb-8">
            <div className="flex-1 h-px bg-[#333333]"></div>
            <span className="px-3 sm:px-4 text-[#888888] text-[11px] sm:text-[12px] font-medium tracking-wider">OR</span>
            <div className="flex-1 h-px bg-[#333333]"></div>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@host.com"
                className="w-full h-[44px] sm:h-[48px] bg-[#333333] border border-[#404040] rounded-[8px] px-4 text-white text-[13px] sm:text-[14px] placeholder-[#888888] focus:outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000] transition-colors duration-200"
                autoComplete="email"
                required
              />
            </div>

            {showPasswordStep && (
              <div>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full h-[44px] sm:h-[48px] bg-[#333333] border border-[#404040] rounded-[8px] px-4 pr-12 text-white text-[13px] sm:text-[14px] placeholder-[#888888] focus:outline-none focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000] transition-colors duration-200"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-[#888888] hover:text-white transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded-[8px] text-red-400 text-[13px] sm:text-[14px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] sm:h-[48px] bg-[#E50000] hover:bg-[#CC0000] disabled:opacity-50 rounded-[8px] text-white text-[13px] sm:text-[14px] font-semibold tracking-wide transition-colors duration-200"
            >
              {loading
                ? showPasswordStep
                  ? 'LOGGING IN...'
                  : 'CONTINUING...'
                : showPasswordStep
                  ? 'LOG IN'
                  : 'CONTINUE'}
            </button>
          </form>

          <div className="text-center pb-8 sm:pb-0">
            <button className="text-[#888888] text-[13px] sm:text-[14px] font-medium hover:text-white transition-colors duration-200">
              Need Help?
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img 
          src="/images/login-bg.png" 
          alt="Samurai silhouette" 
          className="absolute inset-0 w-[90%] h-full ml-36"
        />
        
        <div className="absolute inset-0 bg-gradient-login ml-32"></div>

        {/* Top blend gradient to create visual padding with black mix */}
        {/* <div className="absolute top-0 left-0 right-0 h-40 sm:h-48 lg:h-56 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none"></div> */}

        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-16 right-6 sm:right-8 lg:right-24 max-w-[500px] xl:max-w-[650px] z-10">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
