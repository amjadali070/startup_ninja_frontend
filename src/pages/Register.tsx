import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/auth';
import type { RegisterRequest } from '../types/auth';
import { COUNTRY_OPTIONS } from '../data/countries';

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
  `w-full h-[44px] sm:h-[48px] bg-[#333333] rounded-[8px] px-4 text-white text-[13px] sm:text-[14px] placeholder-[#888888] focus:outline-none transition-colors duration-200 border ${
    hasError
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
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
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
        countryCode: selectedCountry.dialCode,
      };

      const response = await authService.register(payload);
      if (response.success && response.token && response.user) {
        login(response.user, response.token);
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

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      <div className="w-full lg:w-[460px] xl:w-[480px] 2xl:w-[500px] bg-black px-6 sm:mx-0 md:mx-0 lg:mx-32 sm:px-8 md:px-12 lg:px-16 flex flex-col justify-center relative z-10 min-h-screen pt-4 sm:pt-12 lg:pt-6">
        <img
          src="/images/logo.png"
          alt="Startup Ninja"
          className="h-20 sm:h-24 lg:h-28 w-auto mx-auto"
        />

        <div className="w-full max-w-full mx-auto lg:mx-0 pt-10 sm:pt-24 lg:pt-4">
        
          <form className="space-y-3 sm:space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3">
              <div>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
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
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
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
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

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
                  className={getFieldInputClasses(!!fieldErrors.email)}
                  aria-invalid={fieldErrors.email ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('email')}
                  autoComplete="email"
                  required
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
                  Phone Number
                </label>
                <div
                  className={`flex h-[44px] sm:h-[48px] overflow-hidden rounded-[8px] border ${
                    fieldErrors.phoneNumber
                      ? 'border-red-500 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
                      : isCountryOpen
                        ? 'border-[#E50000] focus-within:border-[#E50000] focus-within:ring-1 focus-within:ring-[#E50000]'
                        : 'border-[#404040] focus-within:border-[#E50000] focus-within:ring-1 focus-within:ring-[#E50000]'
                  } bg-[#333333] transition-colors duration-200`}
                >
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 sm:px-4 h-full border-r border-[#2C2C2C] ${
                      isCountryOpen ? 'bg-[#2B2B2B]' : 'bg-[#333333]'
                    } text-white text-[13px] sm:text-[14px] transition-colors duration-200`}
                    aria-label="Select country code"
                  >
                    <span className="flex items-center justify-center w-7 h-5 rounded-[4px] bg-[#1F1F23]">
                      <img
                        src={getFlagUrl(selectedCountry.iso2, 48)}
                        alt={`${selectedCountry.name} flag`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span>{selectedCountry.dialCode}</span>
                    <FiChevronDown
                      className={`ml-1 text-[#888888] transition-transform duration-200 ${
                        isCountryOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                  </button>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(event) => handlePhoneChange(event.target.value)}
                    placeholder="300 1234567"
                    className="flex-1 h-full bg-transparent px-4 text-white text-[13px] sm:text-[14px] placeholder-[#888888] focus:outline-none"
                    aria-invalid={fieldErrors.phoneNumber ? 'true' : 'false'}
                    onBlur={() => runFieldValidation('phoneNumber')}
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </div>

                {fieldErrors.phoneNumber && (
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.phoneNumber}
                  </p>
                )}

                {isCountryOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-[10px] border border-[#2C2C2C] bg-[#1B1B1F] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
                    <div className="border-b border-[#2C2C2C] p-3">
                      <div className="flex items-center gap-2 rounded-[8px] border border-[#2C2C2C] bg-[#121216] px-3 py-2">
                        <FiSearch className="h-4 w-4 text-[#888888]" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={countrySearch}
                          onChange={(event) => setCountrySearch(event.target.value)}
                          placeholder="Search country or code"
                          className="flex-1 bg-transparent text-white text-[13px] sm:text-[14px] placeholder-[#666666] focus:outline-none"
                        />
                      </div>
                    </div>
                    <ul className="max-h-60 overflow-y-auto py-2">
                      {filteredCountries.length === 0 && (
                        <li className="px-4 py-3 text-center text-[13px] text-[#888888]">
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
                            className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-white text-[13px] sm:text-[14px] transition-colors duration-150 hover:bg-[#26262C] ${
                              country.iso2 === selectedCountry.iso2 ? 'bg-[#26262C]' : ''
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-7 h-5 rounded-[4px] bg-[#1F1F23]">
                                <img
                                  src={getFlagUrl(country.iso2, 32)}
                                  alt={`${country.name} flag`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-[#888888] text-[12px]">{country.dialCode}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create your password"
                  className={getFieldInputClasses(!!fieldErrors.password)}
                  aria-invalid={fieldErrors.password ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('password')}
                  autoComplete="new-password"
                  required
                />
                {fieldErrors.password && (
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-[13px] sm:text-[14px] font-medium mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => handleConfirmPasswordChange(event.target.value)}
                  placeholder="Re-enter your password"
                  className={getFieldInputClasses(!!fieldErrors.confirmPassword)}
                  aria-invalid={fieldErrors.confirmPassword ? 'true' : 'false'}
                  onBlur={() => runFieldValidation('confirmPassword')}
                  autoComplete="new-password"
                  required
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-2 text-[12px] text-red-400">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] sm:h-[48px] 
                [background:linear-gradient(90deg,#DC2626_0%,#B91C1C_100%)] 
                hover:[background:linear-gradient(90deg,#B91C1C_0%,#7F1D1D_100%)] 
                disabled:opacity-50 
                rounded-[8px] text-white text-[13px] sm:text-[14px] 
                font-semibold tracking-wide transition-colors duration-200" >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            {serverError && (
              <p className="text-center text-[13px] sm:text-[14px] text-red-400">
                {serverError}
              </p>
            )}
          </form>

          <div className="text-center mt-6 pb-8 sm:pb-0 flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[#9CA3AF] text-[13px] sm:text-[14px] leading-tight">
                Already have an account?
              </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[13px] sm:text-[14px] font-semibold leading-tight bg-gradient-to-r from-[#DC2626] via-[#E50000] to-[#B91C1C] text-transparent bg-clip-text hover:from-[#FF5A5A] hover:via-[#FF1A1A] hover:to-[#B80000] transition-colors duration-200"
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
          className="w-full h-full aspect-[2/1]"
        />
      </div>
    </div>
  );
};

export default Register;
