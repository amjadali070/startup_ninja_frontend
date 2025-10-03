import { useMemo, useState } from 'react';
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { authService } from '../services/auth';
import type { AuthResponse } from '../types/auth';

type TokenResponseWithId = TokenResponse & { id_token?: string };

interface GoogleSignUpProps {
  className?: string;
  onAuthSuccess?: (response: AuthResponse) => void;
  onAuthError?: (message: string) => void;
  buttonText?: 'signup_with' | 'signin_with' | 'continue_with';
}

const GoogleSignUp: React.FC<GoogleSignUpProps> = ({
  className,
  onAuthSuccess,
  onAuthError,
  buttonText = 'signup_with'
}) => {
  const [error, setError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const shouldShowLocalError = !onAuthError;

  const computedLabel = useMemo(() => {
    switch (buttonText) {
      case 'signin_with':
        return 'Sign in with Google';
      case 'signup_with':
        return 'Sign up with Google';
      case 'continue_with':
      default:
        return 'Continue with Google';
    }
  }, [buttonText]);

  if (!googleClientId) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          className="w-full h-[44px] sm:h-[48px] bg-[#333333] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center justify-center px-4 opacity-50 cursor-not-allowed"
        >
          Google sign-in unavailable
        </button>
        {shouldShowLocalError && (
          <p className="mt-2 text-xs text-red-400 text-center">
            Configure VITE_GOOGLE_CLIENT_ID to enable Google login.
          </p>
        )}
      </div>
    );
  }

  const handleAuthError = (message: string) => {
    setError(message);
    onAuthError?.(message);
  };

  const processToken = async (tokenResponse: TokenResponseWithId) => {
    const payload = {
      credential: tokenResponse.id_token,
      accessToken: tokenResponse.access_token,
    };

    if (!payload.credential && !payload.accessToken) {
      handleAuthError('Google did not return usable credentials. Please try again.');
      return;
    }

    setError(null);

    const result = await authService.googleLogin(payload);

    if (!result.success || !result.token) {
      handleAuthError(result.message || 'Unable to authenticate with Google.');
      return;
    }

    onAuthSuccess?.(result);
  };

  const triggerGoogleLogin = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        await processToken(tokenResponse);
      } catch (err) {
        console.error('Google login processing error:', err);
        handleAuthError('An unexpected error occurred while processing Google sign-in.');
      }
    },
    onError: () => {
      handleAuthError('Google sign-in was cancelled or failed. Please try again.');
    }
  });

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => triggerGoogleLogin()}
        className="w-full h-[44px] sm:h-[48px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center justify-center px-4 transition-colors duration-200"
      >
        <FcGoogle className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
        {computedLabel}
      </button>
      {shouldShowLocalError && error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};

export default GoogleSignUp;
