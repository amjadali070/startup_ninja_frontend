import { useState } from 'react';
import GoogleSignUp from './GoogleSignUp';
import MicrosoftSignUp from './MicrosoftSignUp';
import type { AuthResponse } from '../types/auth';

interface SocialAuthProps {
  className?: string;
  onAuthSuccess?: (response: AuthResponse) => void;
  onAuthError?: (message: string) => void;
  buttonText?: 'signup_with' | 'signin_with' | 'continue_with';
  showDivider?: boolean;
}

const SocialAuth: React.FC<SocialAuthProps> = ({
  className,
  onAuthSuccess,
  onAuthError,
  buttonText = 'continue_with',
  showDivider = true
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = (message: string) => {
    setError(message);
    onAuthError?.(message);
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    setError(null);
    onAuthSuccess?.(response);
  };

  return (
    <div className={className}>
      {/* Google Sign Up */}
      <GoogleSignUp
        buttonText={buttonText}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        className="mb-3"
      />

      {/* Microsoft Sign Up */}
      <MicrosoftSignUp
        buttonText={buttonText}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        className="mb-3"
      />

      {/* Common error display */}
      {error && !onAuthError && (
        <p className="mt-2 text-xs text-red-400 text-center">{error}</p>
      )}

      {/* Optional divider */}
      {showDivider && (
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-600"></div>
          <div className="px-3 text-gray-400 text-sm">or</div>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>
      )}
    </div>
  );
};

export default SocialAuth;