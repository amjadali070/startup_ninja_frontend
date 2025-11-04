import { useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest} from '../lib/msalConfig';
import { authService } from '../services/auth';
import type { AuthResponse } from '../types/auth';

interface MicrosoftSignUpProps {
  className?: string;
  onAuthSuccess?: (response: AuthResponse) => void;
  onAuthError?: (message: string) => void;
  buttonText?: 'signup_with' | 'signin_with' | 'continue_with';
}

const MicrosoftSignUp: React.FC<MicrosoftSignUpProps> = ({
  className,
  onAuthSuccess,
  onAuthError,
  buttonText = 'signup_with'
}) => {
  const { instance } = useMsal();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;

  const shouldShowLocalError = !onAuthError;

  const computedLabel = useMemo(() => {
    switch (buttonText) {
      case 'signin_with':
        return 'Sign in with Microsoft';
      case 'signup_with':
        return 'Sign up with Microsoft';
      case 'continue_with':
      default:
        return 'Microsoft';
    }
  }, [buttonText]);

  if (!microsoftClientId) {
    return (
      <div className={className}>
        <button
          type="button"
          disabled
          className="w-full h-[44px] sm:h-[48px] bg-[#333333] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center justify-center px-4 opacity-50 cursor-not-allowed"
        >
          Microsoft sign-in unavailable
        </button>
        {shouldShowLocalError && (
          <p className="mt-2 text-xs text-red-400 text-center">
            Configure VITE_MICROSOFT_CLIENT_ID to enable Microsoft login.
          </p>
        )}
      </div>
    );
  }

  const handleAuthError = (message: string) => {
    setError(message);
    onAuthError?.(message);
  };

  const handleMicrosoftLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initiate the popup login
      const response = await instance.loginPopup(loginRequest);
      
      if (response.accessToken) {
        // Send the access token to your backend
        const authResult = await authService.microsoftLogin({
          accessToken: response.accessToken
        });

        if (!authResult.success || !authResult.token) {
          handleAuthError(authResult.message || 'Unable to authenticate with Microsoft.');
          return;
        }

        onAuthSuccess?.(authResult);
      } else {
        handleAuthError('Microsoft did not return an access token. Please try again.');
      }
    } catch (error: any) {
      console.error('Microsoft login error:', error);
      if (error.errorCode === 'user_cancelled') {
        handleAuthError('Microsoft sign-in was cancelled. Please try again.');
      } else {
        handleAuthError('An unexpected error occurred while signing in with Microsoft.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleMicrosoftLogin}
        disabled={isLoading}
        className="w-full h-[44px] sm:h-[48px] bg-[#333333] hover:bg-[#404040] rounded-[8px] text-white text-[13px] sm:text-[14px] font-medium flex items-center px-4 transition-colors duration-200"
      >
        <img src="/svg/microsoft.svg" alt="Microsoft" className="w-4 sm:w-5 h-4 sm:h-5 mr-3" />
        {isLoading ? 'Signing in...' : computedLabel}
      </button>
      {shouldShowLocalError && error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};

export default MicrosoftSignUp;