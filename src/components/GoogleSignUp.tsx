import { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { authService } from '../services/auth';
import type { AuthResponse } from '../types/auth';

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

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      const message = 'Missing Google credential. Please retry.';
      setError(message);
      onAuthError?.(message);
      return;
    }

    setError(null);

    const result = await authService.googleLogin(credentialResponse.credential);

    if (!result.success || !result.token) {
      const message = result.message || 'Unable to authenticate with Google.';
      setError(message);
      onAuthError?.(message);
      return;
    }

    onAuthSuccess?.(result);
  };

  const handleError = () => {
    const message = 'Google sign-in was cancelled or failed. Please try again.';
    setError(message);
    onAuthError?.(message);
  };

  return (
    <div className={className}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          theme="filled_black"
          shape="pill"
          text={buttonText}
          width="100%"
        />
      </div>
      {shouldShowLocalError && error && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}
    </div>
  );
};

export default GoogleSignUp;
