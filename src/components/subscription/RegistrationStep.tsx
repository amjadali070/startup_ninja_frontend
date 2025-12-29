import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import type { RegisterRequest, AuthResponse } from '../../types/auth';
import { COUNTRY_OPTIONS } from '../../data/countries';
import EmailVerificationModal from '../../components/EmailVerificationModal';
import GoogleSignUp from '../../components/GoogleSignUp';
import MicrosoftSignUp from '../../components/MicrosoftSignUp';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, '');

const FIELD_NAMES = ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword'] as const;
type FieldName = typeof FIELD_NAMES[number];
type FormErrors = Partial<Record<FieldName, string>>;

const validateField = (field: FieldName, value: string, context?: { password?: string }): string => {
  switch (field) {
    case 'fullName': return value.trim() ? '' : 'Full name is required.';
    case 'username': return value.trim() ? '' : 'Username is required.';
    case 'email': return value.trim() && emailRegex.test(value.trim()) ? '' : 'Enter a valid email.';
    case 'phoneNumber': return sanitizePhone(value).length >= 7 ? '' : 'Enter valid phone.';
    case 'password': return value.length >= 6 ? '' : 'Min 6 chars.';
    case 'confirmPassword': return value === (context?.password ?? '') ? '' : 'Passwords do not match.';
    default: return '';
  }
};

interface RegistrationStepProps {
  onSuccess: () => void;
}

const RegistrationStep: React.FC<RegistrationStepProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [regData, setRegData] = useState<RegisterRequest>({ username: '', email: '', password: '' });
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS.find(c => c.iso2 === 'PK') || COUNTRY_OPTIONS[0]);

  const [showVerification, setShowVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{userId: string, email: string} | null>(null);

  const handleSocialAuthSuccess = (response: AuthResponse) => {
    if (response.token && response.user) {
      login(response.user, response.token, response.refreshToken);
      onSuccess();
    }
  };

  const handleSocialAuthError = (message: string) => {
    toast.error(message);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: FormErrors = {};
    const fields: FieldName[] = ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword'];
    fields.forEach(f => {
        let val = '';
        if(f === 'fullName') val = fullName;
        else if(f === 'phoneNumber') val = phoneNumber;
        else if(f === 'confirmPassword') val = confirmPassword;
        else val = (regData as any)[f];
        
        const msg = validateField(f, val, { password: regData.password });
        if(msg) errors[f] = msg;
    });
    
    if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
    }

    setLoading(true);
    try {
        const payload = {
            ...regData,
            fullName: fullName.trim(),
            phoneNumber: `${selectedCountry.dialCode}${sanitizePhone(phoneNumber)}`,
            country: selectedCountry.name
        };
        
        const res = await authService.register(payload);
        
        if (res.success) {
            if (res.requiresEmailVerification && res.userId) {
                setVerificationData({ userId: res.userId, email: regData.email });
                setShowVerification(true);
            } else if (res.token && res.user) {
                login(res.user, res.token, res.refreshToken);
                onSuccess();
            } else {
                 navigate('/login', { state: { message: 'Registration successful. Please login to continue purchase.' } });
            }
        } else {
           toast.error(res.message || 'Registration failed');
        }
    } catch (err: any) {
        toast.error(err.message || 'Registration error');
    } finally {
        setLoading(false);
    }
  };

  const handleVerify = async (otp: string) => {
    if(!verificationData) return;
    try {
        const res = await authService.verifyEmail(verificationData.userId, otp);
        if (res.success && res.token && res.user) {
            login(res.user, res.token, res.refreshToken);
            setShowVerification(false);
            onSuccess();
            toast.success('Email verified! Proceeding to payment.');
        } else {
            throw new Error(res.message);
        }
    } catch (err: any) {
        toast.error(err.message || 'Verification failed');
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 bg-white/5 border ${hasError ? 'border-red-500' : 'border-white/10'} 
    rounded-xl text-white placeholder-gray-500 
    focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 
    transition-all duration-200
  `;

  return (
    <div className="w-full bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Get started with your subscription</p>
        </div>

        {!showEmailForm ? (
          // Social Auth Options
          <div className="space-y-4 max-w-md mx-auto">
            <GoogleSignUp
              buttonText="continue_with"
              onAuthSuccess={handleSocialAuthSuccess}
              onAuthError={handleSocialAuthError}
            />

            <MicrosoftSignUp
              buttonText="continue_with"
              onAuthSuccess={handleSocialAuthSuccess}
              onAuthError={handleSocialAuthError}
            />

            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full h-[44px] sm:h-[48px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center px-4 transition-colors duration-200"
            >
              <FiMail className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
              <span>Continue with Email</span>
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="text-red-500 hover:text-red-400 transition-colors font-medium">Sign in</Link>
            </p>
          </div>
        ) : (
          // Email Registration Form
          <>
            <button
              onClick={() => setShowEmailForm(false)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
            >
              <FiArrowLeft />
              <span>Back to options</span>
            </button>

            <form onSubmit={handleRegister} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={fullName} 
                  onChange={e=>setFullName(e.target.value)} 
                  className={inputClass(!!fieldErrors.fullName)} 
                />
                {fieldErrors.fullName && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.fullName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input 
                  type="text" 
                  placeholder="johndoe" 
                  value={regData.username} 
                  onChange={e=>setRegData({...regData, username: e.target.value})} 
                  className={inputClass(!!fieldErrors.username)} 
                />
                {fieldErrors.username && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={regData.email} 
                  onChange={e=>setRegData({...regData, email: e.target.value})} 
                  className={inputClass(!!fieldErrors.email)} 
                />
                {fieldErrors.email && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="flex gap-3">
                  <select 
                      className="px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all" 
                      value={selectedCountry.iso2} 
                      onChange={(e) => setSelectedCountry(COUNTRY_OPTIONS.find(c => c.iso2 === e.target.value) || selectedCountry)}
                  >
                      {COUNTRY_OPTIONS.map(c => <option key={c.iso2} value={c.iso2} className="bg-black">{c.iso2} {c.dialCode}</option>)}
                  </select>
                  <input 
                    type="tel" 
                    placeholder="1234567890" 
                    value={phoneNumber} 
                    onChange={e=>setPhoneNumber(e.target.value)} 
                    className={inputClass(!!fieldErrors.phoneNumber) + " flex-1"} 
                  />
                </div>
                {fieldErrors.phoneNumber && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.phoneNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={regData.password} 
                        onChange={e=>setRegData({...regData, password: e.target.value})} 
                        className={inputClass(!!fieldErrors.password) + " pr-12"} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={confirmPassword} 
                        onChange={e=>setConfirmPassword(e.target.value)} 
                        className={inputClass(!!fieldErrors.confirmPassword) + " pr-12"} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <p className="text-red-500 text-sm mt-1.5">{fieldErrors.confirmPassword}</p>}
                  </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Continue to Payment'}
              </button>
              
              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account? <Link to="/login" className="text-red-500 hover:text-red-400 transition-colors font-medium">Sign in</Link>
              </p>
            </form>
          </>
        )}

        <EmailVerificationModal 
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          onVerify={handleVerify}
          onResendCode={async () => { await authService.resendOTP(verificationData?.userId || '') }}
          email={verificationData?.email || ''}
          loading={loading}
        />
    </div>
  );
};

export default RegistrationStep;
