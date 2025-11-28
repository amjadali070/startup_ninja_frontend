import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';
import type { RegisterRequest } from '../../types/auth.ts';
import { COUNTRY_OPTIONS } from '../../data/countries.ts';
import EmailVerificationModal from '../../components/EmailVerificationModal.tsx';
import toast from 'react-hot-toast';

const getFlagUrl = (iso2: string, size: number = 32) => {
  const width = size;
  const height = Math.round((size * 3) / 4);
  return `https://flagcdn.com/${width}x${height}/${iso2.toLowerCase()}.png`;
};

const FIELD_NAMES = ['fullName', 'username', 'email', 'phoneNumber', 'password', 'confirmPassword'] as const;
type FieldName = typeof FIELD_NAMES[number];
type FormErrors = Partial<Record<FieldName, string>>;

const isFieldName = (value: string): value is FieldName => {
  return (FIELD_NAMES as readonly string[]).includes(value);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizePhone = (value: string) => value.replace(/[^0-9]/g, '');

const getFieldInputClasses = (hasError: boolean) =>
  `w-full h-[38px] sm:h-[42px] bg-[#333333] rounded-[8px] px-3 text-white text-[11px] sm:text-[12px] placeholder-[#888888] focus:outline-none transition-colors duration-200 border ${hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
    : 'border-[#404040] focus:border-[#E50000] focus:ring-1 focus:ring-[#E50000]'
  }`;

const validateField = (field: FieldName, value: string, context?: { password?: string }): string => {
  switch (field) {
    case 'fullName':
      return value.trim() ? '' : 'Full name is required.';
    case 'username':
      return value.trim() ? '' : 'Username is required.';
    case 'email': {
      const trimmed = value.trim();
      if (!trimmed) {
        return 'Email is required.';
      }
      return emailRegex.test(trimmed) ? '' : 'Enter a valid email address.';
    }
    case 'phoneNumber': {
      const digits = sanitizePhone(value);
      return digits.length >= 7 ? '' : 'Enter a valid phone number.';
    }
    case 'password': {
      if (!value) {
        return 'Password is required.';
      }
      if (value.length < 6) {
        return 'Password must be at least 6 characters long.';
      }
      return '';
    }
    case 'confirmPassword': {
      if (!value) {
        return 'Please confirm your password.';
      }
      if (value !== (context?.password ?? '')) {
        return 'Passwords do not match.';
      }
      return '';
    }
    default:
      return '';
  }
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const updateFieldError = (field: FieldName, message: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const getFieldValue = (field: FieldName) => {
    switch (field) {
      case 'fullName':
        return fullName;
      case 'username':
        return formData.username;
      case 'email':
        return formData.email;
      case 'phoneNumber':
        return phoneNumber;
      case 'password':
        return formData.password;
      case 'confirmPassword':
        return confirmPassword;
      default:
        return '';
    }
  };

  const runFieldValidation = (field: FieldName) => {
    const value = getFieldValue(field);
    const message = validateField(field, value, { password: formData.password });
    updateFieldError(field, message);
    return !message;
  };

  const applyServerFieldErrors = (errors?: Array<{ param: string; msg: string }>) => {
    if (!errors?.length) {
      return false;
    }

    const extracted: FormErrors = {};
    errors.forEach(({ param, msg }) => {
      if (isFieldName(param)) {
        extracted[param] = msg;
      }
    });

    if (Object.keys(extracted).length === 0) {
      return false;
    }

    setFieldErrors((prev) => ({ ...prev, ...extracted }));
    return true;
  };

  const defaultCountry = useMemo(() => {
    return COUNTRY_OPTIONS.find((country) => country.iso2 === 'PK') || COUNTRY_OPTIONS[0];
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) {
      return COUNTRY_OPTIONS;
    }

    return COUNTRY_OPTIONS.filter((country) => {
      const normalizedName = country.name.toLowerCase();
      const normalizedDialCode = country.dialCode.replace('+', '');
      const normalizedQuery = query.replace('+', '');
      return (
        normalizedName.includes(query) ||
        country.dialCode.includes(query) ||
        normalizedDialCode.includes(normalizedQuery)
      );
    });
  }, [countrySearch]);

  useEffect(() => {
    if (!isCountryOpen) {
      setCountrySearch('');
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerError('');

    setFormData((prev) => ({
      ...prev,
      [name as keyof RegisterRequest]: value,
    }));

    if (name === 'username' && fieldErrors.username) {
      updateFieldError('username', validateField('username', value));
    }

    if (name === 'email' && fieldErrors.email) {
      updateFieldError('email', validateField('email', value));
    }

    if (name === 'password') {
      if (fieldErrors.password) {
        updateFieldError('password', validateField('password', value));
      }
      if (fieldErrors.confirmPassword) {
        updateFieldError('confirmPassword', validateField('confirmPassword', confirmPassword, { password: value }));
      }
    }
  };

  const handleFullNameChange = (value: string) => {
    setServerError('');
    setFullName(value);
    if (fieldErrors.fullName) {
      updateFieldError('fullName', validateField('fullName', value));
    }
  };

  const handlePhoneChange = (value: string) => {
    setServerError('');
    const sanitizedDisplay = value.replace(/[^0-9\s-]/g, '');
    setPhoneNumber(sanitizedDisplay);
    if (fieldErrors.phoneNumber) {
      updateFieldError('phoneNumber', validateField('phoneNumber', sanitizedDisplay));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setServerError('');
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      updateFieldError('confirmPassword', validateField('confirmPassword', value, { password: formData.password }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const fieldsToValidate: FieldName[] = [
      'fullName',
      'username',
      'email',
      'phoneNumber',
      'password',
      'confirmPassword',
    ];

    const hasErrors = fieldsToValidate.some((field) => !runFieldValidation(field));
    if (hasErrors) {
      return;
    }

    const sanitizedPhone = sanitizePhone(phoneNumber);

    setLoading(true);

    try {
      const payload: RegisterRequest = {
        ...formData,
        fullName: fullName.trim(),
        phoneNumber: `${selectedCountry.dialCode}${sanitizedPhone}`,
        country: selectedCountry.name,
      };

      const response = await authService.register(payload);
      if (response.success && response.requiresEmailVerification && response.userId) {
        // Show email verification modal
        setVerificationData({
          userId: response.userId,
          email: formData.email
        });
        setShowEmailVerification(true);
      } else if (response.success && response.token && response.user) {
        login(response.user, response.token, response.refreshToken);
        navigate('/dashboard');
      } else if (response.success) {
        navigate('/login', {
          state: { message: 'Registration successful! Please log in.' }
        });
      } else {
        if (!applyServerFieldErrors(response.errors)) {
          setServerError(response.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      if (!applyServerFieldErrors(err.response?.data?.errors)) {
        setServerError(err.response?.data?.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (otp: string) => {
    if (!verificationData) return;

    setVerificationLoading(true);
    try {
      const response = await authService.verifyEmail(verificationData.userId, otp);
      if (response.success && response.token && response.user) {
        login(response.user, response.token, response.refreshToken);
        setShowEmailVerification(false);
        toast.success('Email verified successfully! Welcome to Startup Ninja!');
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Verification failed');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!verificationData) return;

    try {
      const response = await authService.resendOTP(verificationData.userId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to resend OTP');
      }
      toast.success('New OTP has been sent to your email address.');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  };

  const handleCloseVerificationModal = () => {
    // Show alert when user cancels verification
    if (window.confirm('Are you sure you want to cancel email verification? You can verify your email later when you try to login again.')) {
      setShowEmailVerification(false);
      setVerificationData(null);
      toast('You can verify your email later by trying to login again.', {
        icon: 'ℹ️',
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      <div className="w-full lg:w-[420px] xl:w-[440px] 2xl:w-[460px] bg-black px-4 sm:mx-0 md:mx-0 lg:mx-24 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-center relative z-10 min-h-screen pt-3 sm:pt-8 lg:pt-4">

        <Link to="/">
          <img
            src="/images/logo.png"
            alt="Startup Ninja"
            className="h-16 sm:h-18 lg:h-20 w-auto mx-auto"
          />
        </Link>

        <div className="w-full max-w-full mx-auto lg:mx-0 pt-6 sm:pt-16 lg:pt-3">

          <form className="space-y-2.5 sm:space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2.5">
              <div>
                <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => handleFullNameChange(event.target.value)}
                  placeholder="John Doe"
                  className={getFieldInputClasses(!!fieldErrors.fullName)}
                  aria-invalid={fieldErrors.fullName ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('fullName')}
                  required
                />
                {fieldErrors.fullName && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ninja97"
                  className={getFieldInputClasses(!!fieldErrors.username)}
                  aria-invalid={fieldErrors.username ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('username')}
                  required
                />
                {fieldErrors.username && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

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
                  className={getFieldInputClasses(!!fieldErrors.email)}
                  aria-invalid={fieldErrors.email ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('email')}
                  autoComplete="email"
                  required
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                  Phone Number
                </label>
                <div
                  className={`flex h-[38px] sm:h-[42px] overflow-hidden rounded-[8px] border ${fieldErrors.phoneNumber
                      ? 'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
                      : isCountryOpen
                        ? 'border-[#E50000] focus-within:border-[#E50000] focus-within:ring-1 focus-within:ring-[#E50000]'
                        : 'border-[#404040] focus-within:border-[#E50000] focus-within:ring-1 focus-within:ring-[#E50000]'
                    } bg-[#333333] transition-colors duration-200`}
                >
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 h-full border-r border-[#2C2C2C] ${isCountryOpen ? 'bg-[#2B2B2B]' : 'bg-[#333333]'
                      } text-white text-[11px] sm:text-[12px] transition-colors duration-200`}
                    aria-label="Select country code"
                  >
                    <span className="flex items-center justify-center w-6 h-4 rounded-[3px] bg-[#1F1F23]">
                      <img
                        src={getFlagUrl(selectedCountry.iso2, 32)}
                        alt={`${selectedCountry.name} flag`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span>{selectedCountry.dialCode}</span>
                    <FiChevronDown
                      className={`ml-0.5 text-[#888888] transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-white' : ''
                        }`}
                    />
                  </button>
                  <input
                    type="tel"
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                    placeholder="300 1234567"
                    className="flex-1 h-full bg-transparent px-3 text-white text-[11px] sm:text-[12px] placeholder-[#888888] focus:outline-none"
                    aria-invalid={fieldErrors.phoneNumber ? 'true' : 'false'}
                    onBlur={() => runFieldValidation('phoneNumber')}
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </div>

                {fieldErrors.phoneNumber && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.phoneNumber}
                  </p>
                )}

                {isCountryOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-[10px] border border-[#2C2C2C] bg-[#1B1B1F] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                    <div className="border-b border-[#2C2C2C] p-2.5">
                      <div className="flex items-center gap-1.5 rounded-[8px] border border-[#2C2C2C] bg-[#121216] px-2.5 py-1.5">
                        <FiSearch className="h-3.5 w-3.5 text-[#888888]" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={countrySearch}
                          onChange={(event) => setCountrySearch(event.target.value)}
                          placeholder="Search country or code"
                          className="flex-1 bg-transparent text-white text-[11px] sm:text-[12px] placeholder-[#666666] focus:outline-none"
                        />
                      </div>
                    </div>
                    <ul className="max-h-52 overflow-y-auto py-1.5">
                      {filteredCountries.length === 0 && (
                        <li className="px-3 py-2.5 text-center text-[11px] text-[#888888]">
                          No countries found
                        </li>
                      )}
                      {filteredCountries.map((country) => (
                        <li key={country.iso2}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryOpen(false);
                              setCountrySearch('');
                              setServerError('');
                              if (fieldErrors.phoneNumber) {
                                updateFieldError('phoneNumber', validateField('phoneNumber', phoneNumber));
                              }
                            }}
                            className={`flex w-full items-center justify-between gap-2.5 px-3 py-1.5 text-left text-white text-[11px] sm:text-[12px] transition-colors duration-150 hover:bg-[#26262C] ${country.iso2 === selectedCountry.iso2 ? 'bg-[#26262C]' : ''
                              }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="flex items-center justify-center w-6 h-4 rounded-[3px] bg-[#1F1F23]">
                                <img
                                  src={getFlagUrl(country.iso2, 24)}
                                  alt={`${country.name} flag`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-[#888888] text-[10px]">{country.dialCode}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

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
                    placeholder="Create your password"
                    className={`${getFieldInputClasses(!!fieldErrors.password)} pr-10`}
                    aria-invalid={fieldErrors.password ? 'true' : 'false'}
                    onBlur={() => runFieldValidation('password')}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#888888] hover:text-white transition-colors duration-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEye className="w-3.5 h-3.5" /> : <FaEyeSlash className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-[11px] sm:text-[12px] font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => handleConfirmPasswordChange(event.target.value)}
                    placeholder="Re-enter your password"
                    className={`${getFieldInputClasses(!!fieldErrors.confirmPassword)} pr-10`}
                    aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                    onBlur={() => runFieldValidation('confirmPassword')}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#888888] hover:text-white transition-colors duration-200"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <FaEye className="w-3.5 h-3.5" /> : <FaEyeSlash className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-[10px] text-red-400">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full h-[38px] sm:h-[42px] 
                [background:linear-gradient(90deg,#DC2626_0%,#B91C1C_100%)] 
                hover:[background:linear-gradient(90deg,#B91C1C_0%,#7F1D1D_100%)] 
                disabled:opacity-50 
                rounded-[8px] text-white text-[11px] sm:text-[12px] 
                font-semibold tracking-wide transition-colors duration-200" >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {serverError && (
              <p className="text-center text-[11px] sm:text-[12px] text-red-400">
                {serverError}
              </p>
            )}
          </form>

          <div className="text-center mt-4 pb-6 sm:pb-0 flex flex-col items-center gap-1.5">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[#9CA3AF] text-[11px] sm:text-[12px] leading-tight">
                Already have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[11px] sm:text-[12px] font-semibold leading-tight bg-gradient-to-r from-[#DC2626] via-[#E50000] to-[#B91C1C] text-transparent bg-clip-text hover:from-[#FF5A5A] hover:via-[#FF1A1A] hover:to-[#B80000] transition-colors duration-200"
              >
                Login to Startup Ninja
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="/images/register-bg.png"
          alt="Samurai silhouette"
          className="object- w-full h-full aspect-[2/1]"
        />
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={handleCloseVerificationModal}
        onVerify={handleEmailVerification}
        onResendCode={handleResendOTP}
        email={verificationData?.email || ''}
        loading={verificationLoading}
      />
    </div>
  );
};

export default Register;
